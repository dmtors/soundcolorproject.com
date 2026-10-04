
import { RouteComponentProps } from '@reach/router'
import * as cn from 'classnames'
import * as FocusTrap from 'focus-trap-react'
import { useObserver } from 'mobx-react'
import * as React from 'react'

import { Button } from '../../components/Button'
import { fullShareText, shareImage, shareText, shareTitle, shareUrl } from '../../helpers/share'
import { useStores } from '../../state/useStores'

import { bigButton, innerPanel, lastButton, sharePanel, show } from './sharePanel.pcss'

export interface SharePanelProps extends RouteComponentProps {
  show?: boolean
  'data-testid'?: string
}

export const SharePanel: React.FunctionComponent<SharePanelProps> = function SharePanel (props: SharePanelProps) {
  const {
    show: shouldShow,
    'data-testid': testid = 'share-panel',
  } = props
  const { routing } = useStores()
  const [linkCopied, setLinkCopied] = React.useState(false)
  const [isOpen, setOpen] = React.useState(false)
  const openTimeout = React.useRef<any>()
  const lcTimeout = React.useRef<any>()

  function showPanel () {
    return shouldShow === undefined ? routing.showSharePanel : shouldShow
  }

  React.useEffect(() => {
    if (openTimeout.current) {
      clearTimeout(openTimeout.current)
    }
    if (showPanel()) {
      setOpen(true)
    } else {
      openTimeout.current = setTimeout(() => {
        setOpen(false)
      }, 300)
    }
  }, [showPanel()])

  React.useEffect(() => {
    if (linkCopied) {
      if (lcTimeout.current) {
        clearTimeout(lcTimeout.current)
      }
      lcTimeout.current = setTimeout(() => setLinkCopied(false), 3000)
    }
  }, [linkCopied])

  const shareFacebook = () => {
    let url = 'https://www.facebook.com/sharer/sharer.php'
    url += `?u=${encodeURIComponent(shareUrl)}`
    url += `&title=${encodeURIComponent(shareTitle)}`
    url += `&quote=${encodeURIComponent(shareText)}`
    url += `&picture=${encodeURIComponent(shareImage)}`

    open(url, '_blank')
  }

  const shareTwitter = () => {
    let url = 'https://twitter.com/intent/tweet'
    url += `?text=${encodeURIComponent(fullShareText)}`

    open(url, '_blank')
  }

  const copyLink = async (ev: React.MouseEvent) => {
    ev.preventDefault()
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(shareUrl)
    } else {
      const textarea = document.createElement('textarea')
      textarea.innerHTML = shareUrl
      textarea.style.display = 'none'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setLinkCopied(true)
  }

  function renderContent () {
    if (!isOpen) {
      return null
    }
    return (
      <FocusTrap>
        <div className={innerPanel}>
          <div data-testid={`${testid}-start-text`}>Share Sound Color Project on:</div>
          <div>
            <Button
              forceLightText
              className={bigButton}
              preIcon='facebook'
              color='#1877F2'
              onClick={shareFacebook}
              data-testid={`${testid}-facebook-button`}
            >
              Facebook
            </Button>
          </div>
          <div>
            <Button
              forceLightText
              className={bigButton}
              preIcon='twitter'
              color='#1DA1F2'
              onClick={shareTwitter}
              data-testid={`${testid}-twitter-button`}
            >
              Twitter
            </Button>
          </div>
          <div>
            <a href='/sovis' onClick={copyLink} data-testid={`${testid}-copy-link`}>{linkCopied ? 'Link Copied!' : 'Copy Link'}</a>
          </div>
          <div className={lastButton}>
            <Button
              onClick={() => routing.showSharePanel = false}
              data-testid={`${testid}-cancel-button`}
            >
              Cancel
            </Button>
          </div>
        </div>
      </FocusTrap>
    )
  }

  return useObserver(() => (
    <div className={cn(sharePanel, { [show]: showPanel() })} data-testid={testid}>
      {renderContent()}
    </div>
  ))
}
