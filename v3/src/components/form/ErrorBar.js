import { Overlay, Popover } from 'react-bootstrap';

/**
 * 显示错误
 * @show 是否显示 
 * @target 指向的DOM对象 
 * @placement  right,left,top,bottom 四个选项
 * @invalidText 提示内容
 */
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
  

