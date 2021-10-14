import { Element } from './Element.js';


export class Option extends Element { ///////////////////////////////////////////
  constructor(options) {
    super()
    this.option = options.option
    this.$option = this.option.element
    this.select = options.select
    this.$select = this.select.element
    this.parent = options.parent

    this.remakeOption()
    this.hideSubList()
  }


  remakeOption() {
    const { value, textContent, dataset } = this.$option
    const optionId = `option${value}`
    const level = +dataset.level || 1
    const castomOption = `
      <fieldset class="select__option option" id="${optionId}" name="${optionId}" data-level="${level}">
        <label class="option__label">
          <label class="option__checkbox checkbox">
            <input class="checkbox__input" type="checkbox">
          </label>
          <span class="option__text">
            ${textContent}
          </span>
        </label>
        <div class="option__arrow arrow">
          <span class="arrow__icon"></span>
          <span class="arrow__vertical-line"></span>
        </div>
      </fieldset>
      `

    this.parent.renderToElement(castomOption, 'beforeend')

    this.currentOption = new Element(`#${optionId}`)
    this.$currentOption = this.currentOption.getElement()

    this.castomCheckbox = new Element('.checkbox')
    this.$castomCheckbox = this.castomCheckbox.getElement(this.$currentOption)

    this.optionArrow = new Element('.arrow')
    this.$optionArrow = this.optionArrow.getElement(this.$currentOption)

    this.optionText = new Element('.option__text')
    this.$optionText = this.optionText.getElement(this.$currentOption)

    this.setOptionIndent(level)
    this.addHandlerOption()
  }


  setOptionIndent(level) {
    this.$optionText.style.paddingLeft = `${20 + 15 * level}px`
    this.$optionArrow.style.left = `${40 + 15 * level}px`
  }


  addHandlerOption() {
    this.selectedOption = this.selectedOption.bind(this)
    this.$currentOption.addEventListener('change', this.selectedOption)

    this.showSubList = this.showSubList.bind(this)
    this.$optionArrow.addEventListener('click', this.showSubList)
  }


  selectedOption(e) {
    const inputCheckbox = e.target

    this.toggleClassName(this.$castomCheckbox, '_checked', inputCheckbox.checked)
    this.toggleClassName(this.$currentOption, '_selected', inputCheckbox.checked)
  }


  showSubList(e) { /////////////////////////////////////
    if (this.$currentOption.nextElementSibling?.classList.contains('select__options-sublist')) {
      this.$currentOption.nextElementSibling.classList.toggle('_none')
      this.doClassList(this.$optionArrow, 'toggle', '_show-sub-list')

      this.setHeight()
    }
  }


  setHeight() { ///////////////////////////////////////////
    const $lines = this.getDomElement('.arrow__vertical-line', true)

    $lines.forEach(line => {
      if (line.closest('.option').nextElementSibling?.classList.contains('select__options-sublist')) {
        const o = line.closest('.option').nextElementSibling
        line.style.height = `${o.clientHeight}px`
      }
    })
  }


  hideSubList() { //////////////////////////////////////////
    const subLists = new Element('.select__options-sublist')
    const $subLists = subLists.getElements()

    $subLists.forEach(subList => this.doClassList(subList, 'add', '_none'))
  }
}