
import { Component } from 'https://unpkg.com/preact?module'
import { html } from '../html.js'
import { injectAndObserve } from '../state/injectAndObserve.js'
import { resume } from '../audio/context.js'
import { ColorPicker } from './ColorPicker.js'

export const PatternPicker = injectAndObserve(
  ({ patterns }) => ({ patterns }),
  class PatternPicker extends Component {
    setPattern (pattern) {
      resume()
      console.log('setPattern', pattern)
      this.props.patterns.currentPattern = pattern
    }

    renderCustomButtons () {
      if (this.props.patterns.currentPattern === 'custom') {
        return html`
          <div id="custom-colors">
            ${
              this.props.patterns.notes.map(note => html`
                <${ColorPicker} note=${note} />
              `)
            }
          </div>
        `
      }
    }

    render ({ patterns }) {
      const { currentPattern, patternData } = patterns
      const possiblePatterns = Object.keys(patternData)
      return html`
        <div>
          ${
            possiblePatterns.map(pattern => html`
              <button type="button" onclick="${() => this.setPattern(pattern)}" class="${pattern === currentPattern ? 'selected' : ''}">
                ${patternData[pattern].label}
              </button>
            `)
          }
          ${this.renderCustomButtons()}
        </div>
      `
    }
  },
)