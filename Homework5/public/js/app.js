import * as Model from '../js/model.js';

const doc = document; doc.qs = doc.querySelector; doc.qsAll = doc.querySelectorAll;

doc.body.onload = function() {
    populate('home');
    Model.initFirebase(initNavLinks);
}

/**
 * Populate content for pages from the page name provided.
 * @param {String} pageName The name of the page.
 */
function populate(pageName) {
    const holder = doc.qs(".holder");
    fetch(`views/${pageName}.html`)
    .then(response=>response.text())
    .then(result=> {
        holder.innerHTML = result;
        initPage(pageName);
    })
}

/**
 * Initializes the site nav links.
 */
function initNavLinks() {
    const navLinks = doc.qsAll(".navlink");
    for(let link of navLinks) {
        link.onclick = navlinkHandler;
    }
}

/**
 * Click event handler for nav links.
 * @param {Event} e 
 */
function navlinkHandler(e) {
    e.preventDefault();
    populate(this.dataset.page);
}

/**
 * Initializes any handler for the page given.
 * @param {String} pageName Name of the page.
 */
function initPage(pageName) {
    if(pageName == 'home') {
        $(".carousel").carousel({
            interval: 2000
        })
    }
    if(pageName == 'albums') {
        Model.getAlbumBy({value: ``})
        const filterSelects = doc.qsAll('.filteralbum-select');
        for(let select of filterSelects) {
            select.onchange = function() {
                for(let otherSelect of filterSelects) {
                    if(this != otherSelect) {
                        otherSelect.value = "";
                    }
                }
                Model.getAlbumBy({fieldname: this.name, value: this.value});
            }
        }
    }
}