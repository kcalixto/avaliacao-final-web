import { loadAllHtmlInputs } from "./htmlFiller.js"
import { loadDataSection } from "./dataHandler.js"

function load() {
    loadAllHtmlInputs()
    loadDataSection()
}

load()