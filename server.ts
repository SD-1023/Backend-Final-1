import express from 'express';
import usersRoute from './src/Routers/usersRoute';
import addressesRoute from './src/Routers/addressesRoute';
import reviewsRoute from './src/Routers/reviewsRoute';
import productRoute from './src/Routers/productRoute';
import categoryRoute from './src/Routers/categoryRoute';
import brandRoute from './src/Routers/brandRoute';
import searchRoute from './src/Routers/searchRoute';
import wishlistRoute from './src/Routers/wishlistRoute';
// import ordersRoute from './src/Routers/ordersRoute';
import shoppingCartRoute from './src/Routers/shoppingCartRoute';

import {checkSessionId} from './src/Middlewares/checkSession';

import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // enable set cookie
}));

app.use(express.json())
app.use('/Images',express.static('./src/Images'))
app.use('/Images',express.static('./src/images'))

app.use('/users', usersRoute);
app.use('/addresses',checkSessionId, addressesRoute);
app.use('/reviews',checkSessionId,reviewsRoute);
app.use('/products', productRoute);
app.use('/category', categoryRoute);
app.use('/brand', brandRoute);
app.use('/search', searchRoute);
app.use('/wishlist',checkSessionId, wishlistRoute);
// app.use('/orders',checkSessionId, ordersRoute);
app.use('/shopping-cart',checkSessionId, shoppingCartRoute);






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


