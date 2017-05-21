const bodyTags = ["p", "li", "strong", "a", "span"]
const titleTags = _.map(_.range(1, 7), num => "h" + num)

// return all Dom elements given a list of tags
const allElements = tagList => _.flatMap(
    tagList,
    tag => _.map(document.getElementsByTagName(tag), _.identity))

// return if the element has Big Kids or not
// maybe : only check for divs / allow for bold / spans / italics / a
const hasStructuralKids = ele => {
    return $(ele).children().length == 1 || _.some(_.map($(ele).children(), child => {
    return $(child).html().length > 8 || $(child).children().length > 0 || (
        $(child).prop("tagName") === "DIV")
    }))
}

const allElementsClean = tagList => _.filter(allElements(tagList), _.negate(hasStructuralKids))

const nlpNegate = nlpInst => nlpInst.sentences().toNegative()
const nlpToStr = nlpInst => nlpInst.out("text").trim()
const strNegate = str => str
    .replace(/ does /g, " do ")
    .replace(/Does/g, "Do")
    .replace(/Can /g, "Cannot ")
    .replace(/ can /g, " cannot ")
    .replace(/May /g, "May Not ")
    .replace(/ will /g, " will not ")
    .replace(/Will /g, "Will Not ")
    .replace(/ should /g, " should not ")
    .replace(/Should /g, "Should Not ")
    .replace(/ may /g, " may not ")
    .replace(/ is /g, " is not ")
    .replace(/ Is /g, " Is not ")
    .replace(/ not not /gi, " not ") //cleanup

const strCapitalize = str => _.map(str.split('.'), _.capitalize).join('.')

// negate all the damn text
_.map(
    allElementsClean(bodyTags),
    ele => $(ele).text( // update text
        strNegate(strCapitalize( // string ops
            nlpToStr(nlpNegate( // nlp ops
                nlp($(ele).text()) // nlp instance
            ))))))

_.map(
    allElementsClean(titleTags),
    ele => $(ele).text( // update text
        strNegate(nlpToStr( // string ops
            nlpNegate(nlp($(ele).text())).toTitleCase() // nlp ops
        ))))
