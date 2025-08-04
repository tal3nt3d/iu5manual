import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";
import {PublicationPage} from "../publication/index.js";


export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }
    
    get pageRoot() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `   
                <nav class="navbar navbar-expand-lg bg-body-tertiary" style="background-color: #e3f2fd;">
                    <div class="container-fluid">
                        <img src = "https://www.avito.ru/favicon.ico" width="30" height="30" class="d-inline-block align-top" alt="" style = "margin-right: 10px;">
                        <a class="navbar-brand"><h1>Avito</h1></a>
                         <div class="collapse navbar-collapse" id="navbarNavDropdown">
                            <ul class="navbar-nav">
                                <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Все категории 
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Недвижимость</a></li>
                                    <li><a class="dropdown-item" href="#">Транспорт</a></li>
                                    <li><a class="dropdown-item" href="#">Работа</a></li>
                                </ul>
                                </li>
                            </ul>
                        </div>
                        <form class="d-flex" style = "width: 100%;""role="search">
                            <input class="form-control me-3" type="search" placeholder="Поиск по объявлениям" aria-label="Search">
                            <button class="btn btn-primary" id = "publication-button" type = "button" style = "background-color: #1faee9; border-color: #1faee9; height: 60px; color: #fff; margin-right: 15px;">Создать объявление</button>
                            <button class="btn btn-outline-success" type="submit">Найти</button>
                        </form>
                    </div>
                </nav>
                <div id="main-page" class="d-flex flex-wrap justify-content-center" style = "background-color:rgb(236, 241, 245)"><div/>
            `
        )
    }

    async getData() {
        try {
            const response = await fetch('http://localhost:8000/stocks');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    clickPublication(){
        const publicationPage = new PublicationPage(this.parent)
        publicationPage.render()
    }
    
    clickCard(e) {
        const cardId = e.target.dataset.id
    
        const productPage = new ProductPage(this.parent, cardId)
        productPage.render()
    }

    async render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const data = await this.getData();
        data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot);
            productCard.render(item, this.clickCard.bind(this));
        });

        const publicationButtonElement = document.getElementById('publication-button')
        publicationButtonElement.addEventListener('click', this.clickPublication.bind(this))
    }
}
