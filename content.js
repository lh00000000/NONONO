const bodyTags = ["p", "li", "strong", "a", "span"]
const titleTags = _.map(_.range(1, 7), num => "h" + num)
const acceptableChildren = new Set(["B", "I", "SPAN"])

// return all Dom elements given a list of tags
const allElements = tagList => _.flatMap(
    tagList,
    tag => _.map(document.getElementsByTagName(tag), _.identity))

// return if the element has Big Kids or not
// maybe : only check for divs / allow for bold / spans / italics / a
const isProblemChild = child => {
    const jqChild = $(child)

    let getsFreePass = acceptableChildren.has(jqChild.prop("tagName"))
    let hasItsOwnKids = jqChild.children().length > 0
    let isADarnDiv = jqChild.prop("tagName") === "DIV"
    return !getsFreePass && (hasItsOwnKids || isADarnDiv)
}
const isStructural = ele => {
    let jqEle = $(ele)
    let onlyHasOneKid = jqEle.children().length == 1 && jqEle.html().startsWith("<")
    let hasProblemKids = _.some(_.map(jqEle.children(), isProblemChild))
    return hasProblemKids || onlyHasOneKid
}

const allElementsClean = tagList => _.filter(allElements(tagList), _.negate(isStructural))

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
    .replace(/ Cannot Not /g, " Cannot ") //cleanup
    .replace(/ cannot not /g, " cannot ")
    .replace(/ not not /gi, " not ")

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
