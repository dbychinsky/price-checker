import './App.scss';
import {Footer} from "./components/footer/Footer.tsx";
import {observer} from "mobx-react-lite";
import {FakeButtons} from "./components/fakeButtons/FakeButtons.tsx";
import {ProductForm} from "./components/productForm/ProductForm.tsx";
import {ProductList} from './components/productList/ProductList.tsx';
import {StoreContext} from './stores/StoreContext.ts';
import {rootStore} from "./stores/RootStore.ts";
import {Toast} from './components/toast/Toast.tsx';
import { Header } from './components/header/Header.tsx';

export const App = observer(() => {
    return (
        <StoreContext.Provider value={rootStore}>  {/* Оборачиваем в Provider */}
            <div className='app'>
                <div className='wrapper'>
                    <FakeButtons/>
                    <Header/>
                    <ProductForm/>
                    <ProductList/>
                    <Toast/>
                </div>
                <Footer/>
            </div>
        </StoreContext.Provider>
    );
});
