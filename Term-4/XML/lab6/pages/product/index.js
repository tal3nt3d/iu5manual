import {PersonComponent} from "../../components/product/index.js";
import {MainPage} from "../main/index.js";
import {getDataFromServer} from "../../modules/fetch.js";
import {urls} from "../../modules/urls.js";

export class PersonPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    async getData() {
            try {
                const response = await getDataFromServer(urls.getUserInfo(this.id));
                const data = await response.json();
                this.renderData(data.response);
            } catch (e) {
                console.error('Error in getData:', e);
            }
        }

    renderData(item) {
        const person = new PersonComponent(this.pageRoot)
        person.render(item[0])
    }

    get pageRoot() {
        return document.getElementById('person-page')
    }

    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }    

    getHTML() {
        return (
            `
                <nav class="navbar navbar-expand-lg bg-body-tertiary" style="margin: 0; padding: 0;">
                    <div class="container-fluid" style="background-color: #0077FF;">
                        <div class="d-flex align-items-center" style="width: 100%;">
                            <img src="./VK Text Logo White.png" height="50" class="d-inline-block align-top" alt="logo" style="margin-right: 10px;">
                            <form class="d-flex align-items-center flex-grow-1" role="search" style="gap: 0=">
                                <input class="form-control" type="search" placeholder="🔍Поиск" aria-label="Search" style="height: 35px; margin-right: 10px; width: 30%;">
                                <button class="btn btn-primary" id="publication-button" type="button" style="background-color: #0077FF; border-color: #0077FF; height: 60px; color: #fff; font-size: 30px;">♫</button>
                            </form>
                        </div>
                    </div>
                </nav>
                <div class = "row">
                    <div style="padding: 10px;">
                        <button id="back-button" class="btn btn-outline-secondary" style = "background-color: #0077FF; border-color: #0077FF; color: #fff; margin-left: 10px;">Назад</button>
                    </div> 
                </div> 
                <div id="person-page" class="d-flex flex-wrap justify-content-center"></div>
            `
        )
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
    
        this.getData();
                
        const backButtonElement = document.getElementById('back-button')
        backButtonElement.addEventListener('click', this.clickBack.bind(this))
    }
}