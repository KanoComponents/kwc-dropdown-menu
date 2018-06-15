import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@kano/kwc-style/color.js';
import '@kano/kwc-style/typography.js';
import '@polymer/iron-icon/iron-icon.js';
import { dropdown as dropdownIcon } from './icons.js';

class KwcDropdownMenu extends PolymerElement {
    static get is() { return 'kwc-dropdown-menu'; }
    static get template() {
        return html`
            <style>
                :host {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    position: relative;
                    padding: 0 16px;
                    height: 40px;
                    box-sizing: border-box;
                    font-family: var(--font-body);
                    color: var(--color-chateau);
                    text-transform: uppercase;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    background: white;
                    border: 1px solid var(--kwc-dropdown-menu-border-color, #a2a6aa);
                    border-radius: 3px;
                }
                :host([selected]) {
                    border: 1px solid var(--color-kano-orange);
                }
                span {
                    @apply --layout-flex;
                }
                :host(.open),
                :host([selected].open) {
                    border: 1px solid var(--kwc-dropdown-menu-border-color, #a2a6aa);
                    border-radius: 3px 3px 0 0;
                }
                .icon {
                    width: 16px;
                    height: 16px;
                    margin-left: 8px;
                    fill: var(--color-grey);
                    transition: transform 300ms;
                }
                :host(.open) .icon {
                    transform: rotate(-180deg);
                    fill: #ff6900;
                }
                #dropdown-content {
                    visibility: hidden;
                    opacity: 0;
                    z-index: -1;
                    position: absolute;
                    top: 100%;
                    left: -1px;
                    width: 100%;
                    background: white;
                    border-bottom: 1px solid var(--kwc-dropdown-menu-border-color, #a2a6aa);
                    border-left: 1px solid var(--kwc-dropdown-menu-border-color, #a2a6aa);
                    border-right: 1px solid var(--kwc-dropdown-menu-border-color, #a2a6aa);
                    border-radius: 0 0 3px 3px;
                    transform: translateY(-16px);
                    transition: transform 100ms, visibility 0ms linear 100ms, z-index 0ms linear 100ms;
                }
                :host(.open) #dropdown-content {
                    visibility: visible;
                    opacity: 1;
                    z-index: 5;
                    transform: translateY(0%);
                }
                #dropdown-content .dropdown-item {
                    height: 40px;
                    cursor: pointer;
                    text-align: left;
                }
                #dropdown-content .dropdown-item > .key {
                    font-family: var(--font-body);
                    font-size: 14px;
                    font-weight: bold;
                    color: var(--color-chateau);
                    text-transform: uppercase;
                    line-height: 40px;
                    padding-left: 16px;
                }
                #dropdown-content .dropdown-item > .key:hover,
                #dropdown-content .dropdown-item[selected] > .key {
                    color: black;
                    background: var(--kwc-dropdown-menu-selected-background, --color-porcelain);
                }
            </style>
            <span>[[label]]</span>
            <div class="icon">${dropdownIcon}</div>
            <div id="dropdown-content">
                <template is="dom-repeat" items="[[items]]">
                    <div class="dropdown-item" on-click="_onItemClick" selected$="[[_isSelected(item, value)]]">
                        <div class="key">[[item.label]]</div>
                    </div>
                </template>
            </div>
        `;
    }
    static get properties() {
        return {
            label: {
                type: String,
            },
            items: {
                type: Array,
                value: () => [],
            },
            value: {
                type: String,
                notify: true,
            },
            opened: {
                type: Boolean,
                value: false,
                observer: '_openedChanged',
            }
        };
    }
    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this._onClick);
    }
    _onClick(e) {
        this.toggle();
    }
    _addOutsideClickListener() {
        const callback = (e) => {
            if (e.path.indexOf(this) === -1) {
                this.close();
            }
            window.removeEventListener('click', callback);
        };
        window.addEventListener('click', callback);
    }
    _openedChanged() {
        if (this.opened) {
            this.classList.add('open');
            setTimeout(() => {
                this._addOutsideClickListener();
            });
        } else {
            this.classList.remove('open');
        }
    }
    toggle() {
        this.opened = !this.opened;
    }
    close() {
        this.opened = false;
    }
    open() {
        this.opened = true;
    }
    _onItemClick(e) {
        const item = e.model.get('item');
        this.set('value', item.value);
    }
    _isSelected(item, value) {
        return item.value === value;
    }
}

customElements.define(KwcDropdownMenu.is, KwcDropdownMenu);
