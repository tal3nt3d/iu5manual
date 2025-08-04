import {PersonCardComponent} from "../../components/product-card/index.js";
import {PersonPage} from "../product/index.js";
import {getDataFromServer} from "../../modules/fetch.js";
import {urls} from "../../modules/urls.js";
import {groupId} from "../../modules/consts.js";


export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.isCheckBoxChecked = false;
    }
    
    get pageRoot() {
        return document.getElementById('main-page')
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
                                <button class="btn btn-primary" type="button" style="background-color: #0077FF; border-color: #0077FF; height: 60px; color: #fff; font-size: 30px;">🔔</button>
                                <button class="btn btn-primary" type="button" style="background-color: #0077FF; border-color: #0077FF; height: 60px; color: #fff; font-size: 30px; margin-right: 15px">♫</button>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                    <label class="form-check-label" for="flexCheckDefault" style = "color: #fff;">
                                        Вывести друзей
                                    </label>
                                </div>
                            </form>
                        </div>
                    </div>
                </nav>
                <div id="main-page" class="d-flex flex-wrap justify-content-center" style="background-color: rgb(236, 241, 245);"></div>
            `
        )
    }

    async getData() {
        try {
            const response = await getDataFromServer(urls.getGroupMembers(groupId));
            const data = await response.json();
            this.renderData(data.response.items);
        } catch (e) {
            console.error('Error in getData:', e);
        }
    }

    async getFriendsData() {
        try {
            const response = await getDataFromServer(urls.getGroupFriends(groupId));
            const data = await response.json();
            this.renderData(data.response.items);
        } catch (e) {
            console.error('Error in getFriendsData:', e);
        }
    }

    clickCard(e) {
        const cardId = e.target.dataset.id
    
        const personPage = new PersonPage(this.parent, cardId)
        personPage.render()
    }

    renderData(items) {
        items.forEach((item) => {
            const personCard = new PersonCardComponent(this.pageRoot)
            personCard.render(item, this.clickCard.bind(this))
        })
    }

    addCheckboxListener() {
        const checkBoxElement = document.getElementById('flexCheckDefault');
        if (checkBoxElement) {
            checkBoxElement.checked = this.isCheckboxChecked;

            checkBoxElement.addEventListener('change', () => {
                this.isCheckboxChecked = checkBoxElement.checked;

                if (this.isCheckboxChecked) {
                    this.parent.innerHTML = '';
                    const html = this.getHTML();
                    this.parent.insertAdjacentHTML('beforeend', html);
                    this.getFriendsData();
                    this.addCheckboxListener();
                } else {
                    this.parent.innerHTML = '';
                    const html = this.getHTML();
                    this.parent.insertAdjacentHTML('beforeend', html);
                    this.getData();
                    this.addCheckboxListener();
                }
            });
        }
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
    
        this.getData()

        this.addCheckboxListener()
    }
}
