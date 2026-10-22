
import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', router)

app.get('/', (req, res) => {
    return res.json({
        message: "API Inventario funcionando"
    });
});
console.log("APP INVENTARIO CARGADA");
export default app;