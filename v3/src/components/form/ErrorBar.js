

import { Overlay, Popover } from 'react-bootstrap';

export default function ErrorBar({show,target,placement,invalidText}) {
      
    return (
        <Overlay
        show={show}
        target={target}
        placement={placement}
        containerPadding={20}
        >
        <Popover>
          <Popover.Body style={{color:'red'}}>
            {invalidText}
          </Popover.Body>
        </Popover>
        </Overlay>
    );
  }
  

