import { ProductType } from "../context/ProductsProvider";
import { ReducerActionType, ReducerAction } from "../context/CartProvider";
import { ReactElement, memo } from "react";

type PropsType = {
  product: ProductType;
  dispatch: React.Dispatch<ReducerAction>;
  REDUCER_ACTIONS: ReducerActionType;
  inCart: boolean;
};

const Product = ({
  product,
  dispatch,
  REDUCER_ACTIONS,
  inCart,
}: PropsType): ReactElement => {
  // old way to import images dynamically
  // const img: string = require(`../images/${product.sku}.jpg`)

  // better way for doing this
  // work with both createReactApp and Vite

  const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url)
    .href;
  console.log(img);

  const onAddToCart = () =>
    dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, qty: 1 } });
  // why qty: 1 reason because it'll give error see video for more info, although we already handled qty in our reducer

  const itemInCart = inCart ? " → Item in Cart: ✔️" : null;

  const content = (
    <article className="product">
      <h3>{product.name}</h3>
      <img src={img} alt={product.name} className="product__img" />
      <p>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
        {itemInCart}
      </p>

      <button onClick={onAddToCart}>Add To Cart</button>
    </article>
  );

  return content;
};

// see in index signatures and assertions chapter for this
// keyof assertion
function areProductsEqual(
  { product: prevProduct, inCart: prevInCart }: PropsType,
  { product: nextProduct, inCart: nextInCart }: PropsType
) {
  return (
    Object.keys(prevProduct).every((key) => {
      return (
        prevProduct[key as keyof ProductType] ===
        nextProduct[key as keyof ProductType]
      );
    }) && prevInCart === nextInCart
  );
}

const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual);

export default MemoizedProduct;
