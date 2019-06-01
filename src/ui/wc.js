class RichAnchor extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    const wrapper = document.createElement('span')
    wrapper.setAttribute('class', 'wrapper')

    const icon = document.createElement('a')
    icon.setAttribute('class', 'icon')
    icon.setAttribute('tabindex', 0)
    icon.setAttribute('target', '_blank')
    icon.setAttribute('rel', 'noopener noreferrer')

    icon.setAttribute('href', this.getAttribute('href'))
    const info = document.createElement('span')
    info.setAttribute('class', 'info')

    const text = this.getAttribute('data-text')
    info.textContent = text

    let imgUrl = this.getAttribute('img')

    icon.innerHTML = `${this.innerHTML} &nbsp;`

    const img = document.createElement('img')
    img.src = imgUrl
    icon.appendChild(img)
    const style = document.createElement('style')
    style.textContent = `
      .wrapper {
        position: relative;
        margin: 5px;
      }
      .info {
        font-size: 0.8rem;
        width: 320px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 6px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: -40px;
        left: 85px;
        z-index: 3;
      }
      a {
        text-decoration: none;
      }
      img {
        width: 1.2rem;
        vertical-align: top;
      }
      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `
    shadow.appendChild(style)
    shadow.appendChild(wrapper)
    wrapper.appendChild(icon)
    wrapper.appendChild(info)
  }
}
customElements.define('rich-a', RichAnchor)
