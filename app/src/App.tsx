import './App.scss';
import { Footer } from "./components/footer/Footer.tsx";
import { observer } from "mobx-react-lite";
import { FakeButtons } from "./components/fakeButtons/FakeButtons.tsx";
import { ProductForm } from "./components/productForm/ProductForm.tsx";
import { Service } from "./service/Service.ts";
import { globalStore } from "./store/globalStore.ts";

export const service = new Service();

export const App = observer(() => {
    return (
        <div className='app'>
            <div className='wrapper'>
                <FakeButtons/>
                {/*<Header/>*/}
                <ProductForm/>
                <div>
                    {globalStore.productListView.map(item => (
                        <>
                            {item.id}
                            {item.productName}
                            <div key={item.id}>{item.priceList.map(item2 => (
                                <div key={item.id}>
                                    <div>{item2.priceProduct}</div>
                                    <div>{item2.priceBasic}</div>
                                    <div>{item2.priceTotal}</div>
                                </div>))}
                            </div>
                        </>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
});
