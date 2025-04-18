import './App.scss';
import { Footer } from "./components/footer/Footer.tsx";
import { observer } from "mobx-react-lite";
import { FakeButtons } from "./components/fakeButtons/FakeButtons.tsx";
import { ProductForm } from "./components/productForm/ProductForm.tsx";
import { Service } from "./service/Service.ts";
import { ProductList } from './components/productList/ProductList.tsx';
// import { Header } from './components/header/Header.tsx';

export const service = new Service();

export const App = observer(() => {
    return (
        <div className='app'>
            <div className='wrapper'>
                <FakeButtons/>
                {/*<Header/>*/}
                <ProductForm/>
                <ProductList/>
            </div>
            <Footer/>
        </div>
    )
});
