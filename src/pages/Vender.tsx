import { SyntheticEvent, useState } from "react";
import { ProductType, useProducts } from "../context/ProductsContext";
import { useSales } from "../context/SalesContext";
import type { PreSale } from "../context/SalesContext";
import { useStore } from "../context/StoreContext";

import {
  Typography,
  Button,
  Grid,
  Container,
  TextField,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core";

const Vender = () => {
  const { products } = useProducts();
  const { addSale } = useSales();
  const [shoppingBag, setShoppingBag] = useState<ProductType[]>([]);
  const [selected, setSelected] = useState("");
  const store = useStore();

  const addProductToShoppingBag = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!products || !selected.length) return;
    const product = products.find((p) => p.id === selected);
    if (product) {
      setShoppingBag([...shoppingBag, product]);
    }
    setSelected("");
  };

  const handlePaid = () => {
    if (!shoppingBag.length) return;
    const reducer = (accumulator: number, currentValue: ProductType) =>
      accumulator + currentValue.price;
    const presale: PreSale = {
      products: shoppingBag,
      store: store?.id || "",
      total: shoppingBag.reduce(reducer, 0),
    };
    addSale(presale);
  };

  const removeItemSelected = (index: number) => {
    shoppingBag.splice(index, 1);
    setShoppingBag([...shoppingBag]);
  }

  const clearTicket = () => {
    setShoppingBag([]);
  }

  return (
    <main>
      <Typography variant="h4">Carrito de compras</Typography>
        <Container >
        <Grid container spacing={3}>
          <Grid item sm={7}>
            <form  onSubmit={addProductToShoppingBag} noValidate autoComplete="off" >
                  
                    <TextField id="outlined-basic" variant="outlined" label="Product ID" fullWidth 
                      value={selected} onChange={(e) => setSelected(e.target.value)} style={{ margin: 10 }} />
                    <Button variant="contained" color="primary" type="submit">Add</Button>
            </form>
          </Grid>
          <Grid item sm={5}>
            <Card>
              <CardContent >
                <Typography variant="h5" component="h2" align="center">
                  Productos
                </Typography>
                <Typography >Producto - precio</Typography>
                <Typography color="textSecondary" >
                {shoppingBag &&
                  shoppingBag.map(({ name, price}, index) => (
                  <div key={index}>
                    <p>
                    {index+1}. {name} - ${price} 
                    <Button color="secondary" onClick={
                      () => removeItemSelected(index)
                    }>Delete</Button>
                    </p>                  
                  </div>                
                ))}
                </Typography>
              </CardContent>
              <CardActions >
                <Button variant="contained" color="primary" onClick={clearTicket}>Limpiar</Button>
                <Button variant="contained" color="primary" onClick={handlePaid}>Finalizar compra</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </main>

  );
};

export default Vender;
