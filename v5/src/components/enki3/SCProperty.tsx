import React, {
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { PublicMess, LockSvg, SomeOne } from "@/lib/jssvg/SvgCollection";
import { InputGroup, Form, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import ImageWithFallback from "../ImageWithFallback";


interface SCPropertyProps {
  children?: ReactNode;
  currentObj?:EnkiMessType|null;
  accountAr?: AccountType[];
  isSC?: boolean;  //是否公器发文，是则不显示 嗯文性质，默认公共
}

export interface SCPropertyRef {
  getData: () => number;
  getAccount: () => string;
}

const SCProperty = forwardRef<SCPropertyRef, SCPropertyProps>(
  ({ children, currentObj, accountAr, isSC }, ref) => {
    const actor = useSelector(
      (state: any) => state.valueData.actor
    ) as { actor_name?: string };
    const t = useTranslations("ff");

    const div1Ref = useRef<HTMLDivElement | null>(null); //@用户窗口
    const div2Ref = useRef<HTMLDivElement | null>(null); //属性选择窗口
    const selectRef = useRef<HTMLInputElement | null>(null); //@输入框

    const [showProperty, setShowProperty] = useState(false);
    const [searInput, setSearInput] = useState(false);
    const [propertyIndex, setPropertyIndex] = useState<number>(
      currentObj?.property_index ?? 1
    );
    const [filterData, setFilterData] = useState<AccountType[]|undefined>(accountAr);
    const [selectUser, setSelectUser] = useState<string[]>(
      currentObj?.account_at ? JSON.parse(currentObj.account_at) : []
    );

    useImperativeHandle(ref, () => ({
      getData: () => propertyIndex,
      getAccount: () =>
        propertyIndex === 3 && selectUser.length
          ? JSON.stringify(selectUser)
          : "",
    }));

    const handleClickOutside = (event: MouseEvent) => {
      if (div1Ref.current && !div1Ref.current.contains(event.target as Node)) {
        setSearInput(false);
      }
      if (div2Ref.current && !div2Ref.current.contains(event.target as Node)) {
        setShowProperty(false);
      }
    };

    useEffect(() => {
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }, []);

    const onChange = () => {
      const v = selectRef.current?.value.toLowerCase().trim() ?? "";
      if (v) {
        const user = new Set(selectUser);
        const curData = accountAr?.filter(
          (o) =>
            o.actor_name.toLowerCase().includes(v) &&
            !user.has(o.actor_name) &&
            o.actor_name.toLowerCase() !== actor?.actor_name?.toLowerCase()
        );
        setFilterData(curData);
        setSearInput((curData?.length ?? 0) > 0);
      } else setSearInput(false);
    };

    const handleSelect = (name: string) => {
      setSelectUser([...selectUser, name]);
      setSearInput(false);
    };

    const handleCloseAlert = (idx: number) => {
      selectUser.splice(idx, 1);
      setSelectUser([...selectUser]);
    };

    return (
      <>
        <Row>
          <Col>
            {/* {!isSC && ( */}
              <button
                className="btn btn-light"
                onClick={() => setShowProperty(true)}
              >
                {propertyIndex === 1 ? (
                  <div className="d-flex align-items-center">
                    <PublicMess size={18} />
                    <span style={{ display: "inline-block", paddingLeft: 4 }}>
                      {t("publicMess")}
                    </span>
                  </div>
                ) : propertyIndex === 2 ? (
                  <div className="d-flex align-items-center">
                    <LockSvg size={24} />
                    <span>{t("followMess")}</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <SomeOne size={24} />
                    <span>{t("someonrMess")}</span>
                  </div>
                )}
              </button>
            {/* )} */}
          </Col>
          <Col className="col-auto">{children}</Col>
        </Row>

        <div style={{ position: "relative" }}>
          {showProperty && (
            <div
              ref={div2Ref}
              className="messpopup"
              style={{ position: "absolute", zIndex: 1300 }}
            >
              <div
                className="messoption d-flex align-items-center"
                onClick={() => {
                  setPropertyIndex(1);
                  setShowProperty(false);
                }}
              >
                <PublicMess />
                <div style={{ paddingLeft: 8 }}>
                  <b>{t("publicMess")}</b>
                  <br />
                  {t("publicMess1")}
                </div>
              </div>
              <div
                className="messoption d-flex align-items-center"
                onClick={() => {
                  setPropertyIndex(2);
                  setShowProperty(false);
                }}
              >
                <LockSvg />
                <div style={{ paddingLeft: 8 }}>
                  <b>{t("followMess")}</b>
                  <br />
                  {t("followMess1")}
                </div>
              </div>
              <div
                className="messoption d-flex align-items-center"
                onClick={() => {
                  setPropertyIndex(3);
                  setShowProperty(false);
                }}
              >
                <SomeOne />
                <div style={{ paddingLeft: 8 }}>
                  <b>{t("someonrMess")}</b>
                  <br />
                  {t("someonrMess1")}
                </div>
              </div>
            </div>
          )}
        </div>

        {propertyIndex === 3 && (
          <>
            <InputGroup>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control
                placeholder="Search user"
                ref={selectRef}
                onKeyUp={onChange}
                onClick={onChange}
              />
            </InputGroup>
            <div style={{ position: "relative" }}>
              {searInput && (
                <div
                  ref={div1Ref}
                  className="messpopup"
                  style={{ position: "absolute", zIndex: 1300 }}
                >
                  {filterData?.map((obj, idx) => (
                    <div
                      key={idx}
                      className="messoption d-flex align-items-center"
                      onClick={() => handleSelect(obj.actor_name)}
                    >
                      <ImageWithFallback
                        src={obj.avatar}
                        fallback="/user.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span>{obj.actor_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectUser.map((namestr, idx) => (
              <span key={idx} style={{ display: "inline-block", paddingLeft: 10 }}>
                <b>{namestr}</b>{" "}
                <svg
                  onClick={() => handleCloseAlert(idx)}
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                </svg>
              </span>
            ))}
            <hr />
          </>
        )}
      </>
    );
  }
);
SCProperty.displayName="SCProperty";
export default React.memo(SCProperty);
