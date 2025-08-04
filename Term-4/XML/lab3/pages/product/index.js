import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {PublicationPage} from "../publication/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    async getData() {
        try {
            const response = await fetch(`http://localhost:8000/stocks/${this.id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }    

    clickPublication(){
            const publicationPage = new PublicationPage(this.parent)
            publicationPage.render()
    }

    async clickDelete(){
        await fetch(`http://localhost:8000/stocks/${this.id}`, {
            method: 'DELETE'
        })
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }

    getHTML() {
        return (
            `
                <style>
                    body {
                        background-color: #e3f2fd;
                        margin: 0;
                        padding: 0;
                    }
                </style>
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
                            <button class="btn btn-outline-secondary" id = "publication-button" type = "button" style = "background-color: #1faee9; border-color: #1faee9; color: #fff; margin-right: 15px;">Создать объявление</button>
                            <button class="btn btn-outline-success" type="submit">Найти</button>
                        </form>
                    </div>
                </nav>
                <div class = "row">
                    <div style="padding: 10px; background-color: rgb(236, 241, 245);">
                        <button id="back-button" class="btn btn-outline-secondary" style = "background-color: #1faee9; border-color: #1faee9; color: #fff; margin-left: 10px;">Назад</button>
                        <button id="delete-button" class="btn btn-outline-secondary" style = "background-color: #1faee9; border-color: #1faee9; color: #fff; position: absolute; right: 10px;">Удалить объявление</button>
                    </div>  
                    <div id="product-page" class="d-flex flex-wrap justify-content-center" style = "background-color:rgb(236, 241, 245)"></div>
                    
                    <div class="d-flex flex-column justify-content-center align-items-center">
                        <div class="mb-3" style = "width: 700px; fix-height: 200px;">
                            <textarea class="form-control" id="exampleFormControlTextarea1" placeholder="Задайте вопрос продавцу" style="min-height: 8rem;"></textarea>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <button id = "chat-button" type="button" class="btn btn-primary btn-lg" style = "background-color: #1faee9; border-color: #1faee9; color: #fff;">К переписке</button>
                            </div>
                        </div>
                    </div>
                    <div id="liveAlertPlaceholder" style="position: fixed; top:20px; left: 40%;"></div>
    
                </div>
            `
        )
    }

    async render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
    
        const data = await this.getData();
        if (data) {
            const stock = new ProductComponent(this.pageRoot);
            stock.render(data);
        }

        const backButtonElement = document.getElementById('back-button')
        backButtonElement.addEventListener('click', this.clickBack.bind(this))

        const appendAlert = (message, type) => {
            const wrapper = document.createElement('div')
            wrapper.innerHTML = [
                `<div class="alert alert-warning alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('')

            const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
            alertPlaceholder.append(wrapper)

            setTimeout(() => {
                wrapper.remove()
            }, 3000)
        }

        const chatButtonElement = document.getElementById('chat-button')
        if (chatButtonElement) {
            chatButtonElement.addEventListener('click', () => {
                appendAlert('Чат с продавцом временно недоступен!', 'success')
            })
        }

        const publicationButtonElement = document.getElementById('publication-button')
        publicationButtonElement.addEventListener('click', this.clickPublication.bind(this))

        const deleteButtonElement = document.getElementById('delete-button')
        deleteButtonElement.addEventListener('click', this.clickDelete.bind(this))
    }
}