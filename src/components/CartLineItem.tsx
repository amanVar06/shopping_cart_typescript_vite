import { ChangeEvent, ReactElement, memo } from "react";
import {
  CartItemType,
  ReducerActionType,
  ReducerAction,
} from "../context/CartProvider";

type PropsType = {
  item: CartItemType; // just need to make sure if items are equal
  dispatch: React.Dispatch<ReducerAction>; // already has referential equality
  REDUCER_ACTIONS: ReducerActionType; // already memoized in context
};

const CartLineItem = ({ item, dispatch, REDUCER_ACTIONS }: PropsType) => {
  // dynamic image
  const img: string = new URL(`../images/${item.sku}.jpg`, import.meta.url)
    .href;

  // a quick calculation, no need to memoize it or
  // no need to keep it in context
  const lineTotal: number = item.qty * item.price;

  const highestQty: number = 20 > item.qty ? 20 : item.qty;

  const optionValues: number[] = [...Array(highestQty).keys()].map(
    (i) => i + 1
  ); // 1 to highest qty

  const options: ReactElement[] = optionValues.map((val) => {
    return (
      <option key={`opt${val}`} value={val}>
        {val}
      </option>
    );
  });

  const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: REDUCER_ACTIONS.QUANTITY,
      payload: { ...item, qty: Number(e.target.value) },
    });
  };

  const onRemoveFromCart = () =>
    dispatch({
      type: REDUCER_ACTIONS.REMOVE,
      payload: item,
    });

  const content = (
    <li className="cart__item">
      <img src={img} alt={item.sku} className="cart__img" />
      <div aria-label="Item Name">{item.name}</div>
      <div aria-label="Price Per Item">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.price)}
      </div>

      <label htmlFor="itemQty" className="offscreen">
        Item Quantity
      </label>

      <select
        name="itemQty"
        id="itemQty"
        className="cart__select"
        value={item.qty}
        aria-label="Item Quantity"
        onChange={onChangeQty}
      >
        {options}
      </select>

      <div className="cart__item-subtotal" aria-label="Line Item Subtotal">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(lineTotal)}
      </div>

      <button
        className="cart__button"
        aria-label="Remove Item From Cart"
        title="Remove Item From Cart"
        onClick={onRemoveFromCart}
      >
        ❌
      </button>
    </li>
  );

  return content;
};

// function to compare for memo
// renaming item as prevItem and nextItem
function areItemsEqual(
  { item: prevItem }: PropsType,
  { item: nextItem }: PropsType
) {
  return Object.keys(prevItem).every((key) => {
    return (
      prevItem[key as keyof CartItemType] ===
      nextItem[key as keyof CartItemType]
    ); //assertion here
  });
}
// see in index signatures and assertions chapter for this
// keyof assertion

const MemoizedCartLineItem = memo<typeof CartLineItem>(
  CartLineItem,
  areItemsEqual
); // it also takes a function
// Now if we change the quantity of one cart item other should not re-render

export default MemoizedCartLineItem;
