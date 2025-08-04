import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {PublishButtonComponent} from "../../components/publish-button/index.js";

export class PublicationPage {
    constructor(parent, id) {
        this.parent = parent
    }

    get pageRoot() {
        return document.getElementById('publication-page')
    }

    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }    

    async getLastStockId() {
        try {
            const response = await fetch('http://localhost:8000/stocks');
            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }
            const stocks = await response.json();
            if (stocks.length === 0) {
                return 0;
            }
            const lastStock = stocks[stocks.length - 1];
            return lastStock.id;
        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
        }
    }

    async clickPublish() {
        const title = document.getElementById('titleArea').value;
        const src = document.getElementById('photoArea').value;
        const text = document.getElementById('textArea').value;
        const description = document.getElementById('descriptionArea').value;
    
        if (!title || !src || !text || !description) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
    
        try {
            const lastId = await this.getLastStockId();
            const newId = parseInt(lastId) + 1;
    
            const data = {
                id: newId,
                src: src,
                title: title,
                text: text,
                description: description,
            };
            const response = await fetch('http://localhost:8000/stocks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error('Ошибка при отправке данных');
            }
    
            const result = await response.json();
            alert('Объявление успешно опубликовано!');
            this.clickBack();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при публикации объявления.');
        }
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
                <div style="padding: 10px; background-color: rgb(236, 241, 245);">
                    <button id="back-button" class="btn btn-outline-secondary" style = "background-color: #1faee9; border-color: #1faee9; color: #fff;">Назад</button>
                </div>  
                <div id="publication-page" class="d-flex flex-wrap justify-content-center" style = "background-color:rgb(236, 241, 245)"></div>

                <div class="d-flex flex-column justify-content-center align-items-center">
                    <div class="mb-3" style = "width: 700px; min-height: 10px;">
                        <textarea class="form-control" id="titleArea" placeholder="Напишите название товара" style="max-height: 10px;"></textarea>
                    </div>
                    <div class="mb-3" style = "width: 700px; min-height: 10px;">
                        <textarea class="form-control" id="textArea" placeholder="Введите стоимость товара" style="max-height: 10px;"></textarea>
                    </div>
                    <div class="mb-3" style = "width: 700px;">
                        <textarea class="form-control" id="descriptionArea" placeholder="Расскажите подробнее о товаре и его характеристиках" style="min-height: 8rem;"></textarea>
                    </div>
                    <div class="mb-3" style = "width: 700px; min-height: 10px;">
                        <textarea class="form-control" id="photoArea" placeholder="Прикрепите ссылку на фото товара" style="max-height: 20px;"></textarea>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <button id = "publish-button" type="button" class="btn btn-primary btn-lg" style = "background-color: #1faee9; border-color: #1faee9; color: #fff;">Опубликовать!</button>
                        </div>
                    </div>
                </div>
            `
        )
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButtonElement = document.getElementById('back-button')
        backButtonElement.addEventListener('click', this.clickBack.bind(this))

        const publishButtonElement = document.getElementById('publish-button')
        publishButtonElement.addEventListener('click', this.clickPublish.bind(this))
    }
}