const textyTags = _.union(
    ["p", "li", "strong", "a", "span"],
    _.map(_.range(1, 7), num => "h" + num) // header elements
)

const textyElements = _.flatMap(
    textyTags,
    x => _.map(
        document.getElementsByTagName(x),
        _.identity
    ))

const hasKids = ele => _.some(_.map($(ele).children(), child => {
    return $(child).html().length > 16 || $(child).children().length > 0 || (
        $(child).prop("tagName") === "A")
}))

_.map(
    _.filter(textyElements, _.negate(hasKids)),
    ele => $(ele).text(
        _.capitalize(
            nlp($(ele).text())
                .sentences()
                .toNegative()
                .out("text")
                .trim())))