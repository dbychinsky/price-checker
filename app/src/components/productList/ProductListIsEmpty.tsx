import './ProductList.scss';

export const ProductListIsEmpty = () => {
    return (
        <div className='product-list-is-empty'>
            <div>Список пуст</div>
            <div>Добавьте свой первый товар!</div>
        </div>
    );
};