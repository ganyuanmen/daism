import { Form, InputGroup } from 'react-bootstrap';
import React, {
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
} from 'react';
import ErrorBar from './ErrorBar';

// 外部可以调用的方法
export interface DaismInputGroupHandle {
  getData: () => string;
  notValid: (errorText: string) => void;
  mySetValue: (v: string) => void;
}

// Props 类型
interface DaismInputGroupProps {
  title: string;
  defaultValue?: string|number;
  horizontal?: boolean;
  readonly?: boolean;
}

const DaismInputGroup = forwardRef<
  DaismInputGroupHandle,
  DaismInputGroupProps
>(({ title, defaultValue, ...props }, ref) => {
  const [showError, setShowError] = useState(false);
  const [invalidText, setInvalidText] = useState('');
  const editRef = useRef<HTMLInputElement | null>(null);

  const getData = () => {
    return editRef.current?.value ?? '';
  };

  const notValid = (errorText: string) => {
    setShowError(true);
    setInvalidText(errorText);
  };

  const mySetValue = (v: string) => {
    if (editRef.current) {
      editRef.current.value = v;
    }
  };

  useImperativeHandle(ref, (): DaismInputGroupHandle => ({
    getData,
    notValid,
    mySetValue,
  }));

  return (
    <>
      {props.horizontal ? (
        <InputGroup className="mb-2">
          <InputGroup.Text>{title}</InputGroup.Text>
          <Form.Control
            ref={editRef}
            isInvalid={showError}
            type="text"
            disabled={props.readonly}
            defaultValue={defaultValue}
            placeholder={title}
            onFocus={() => {
              setShowError(false);
            }}
          />
        </InputGroup>
      ) : (
        <Form.Group className="mb-2">
          <Form.Label
            className="mb-0"
            style={{ marginLeft: '6px' }}
          >
            {title}:
          </Form.Label>
          <Form.Control
            ref={editRef}
            isInvalid={showError}
            type="text"
            disabled={props.readonly}
            defaultValue={defaultValue}
            placeholder={title}
            onFocus={() => {
              setShowError(false);
            }}
          />
        </Form.Group>
      )}
      <ErrorBar
        show={showError}
        target={editRef.current} // 兼容 Overlay target 类型
        placement="bottom"
        invalidText={invalidText}
      />
    </>
  );
});

export default React.memo(DaismInputGroup);
