import { Overlay, Popover } from "react-bootstrap";
import { User1Svg } from "@/lib/jssvg/SvgCollection";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import EnkiMember from "./EnkiMember";
import { useTranslations } from "next-intl";
import { type RootState } from "@/store/store";


interface Props {
  isShow?: boolean;
}

/**
 * 显示未注册帐号
 * @locale zh/cn
 */
export default function EnkiAccount({ isShow = true }: Props) {
  const t = useTranslations("ff");
  const actor = useSelector((state: RootState) => state.valueData.actor) as DaismActor;
  const target = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false); //是否注册， 

  //有帐号表示已注册
  useEffect(() => {
    if (actor && actor.manager) {
      if (actor.actor_account) setShow(false);
      else setShow(true);
    } else {
      setShow(false);
    }
  }, [actor]);

  return (
    <div
      className="d-inline-flex align-items-center p-2"
      style={{ minWidth: "200px" }}
    >
      {actor && actor.manager ? ( // 已登录
        <>
          {actor.actor_account ? ( // 已注册
            <>{isShow && <EnkiMember url={actor?.actor_url??''} hw={64}  account={actor?.actor_account??''} avatar={actor?.avatar??''} manager={actor?.manager} />
            }</>
          ) : (
            <div onClick={() => setShow(false)}>
              {/* 未注册 */}
              <div ref={target}>
                <User1Svg size={64} />
              </div>
              <Overlay
                show={show}
                target={target.current}
                placement="right"
                containerPadding={4}
              >
                <Popover id="popover-contained">
                  <Popover.Header as="h3">{t("registerTips")}</Popover.Header>
                  <Popover.Body>{t("registerShow")}</Popover.Body>
                </Popover>
              </Overlay>
            </div>
          )}
        </>
      ) : (
        // 游客
        <>
          <User1Svg size={64} />
          <div style={{ paddingLeft: "10px" }}>
            <h3>{t("invitMember")}</h3> {/* 不登录显示游客 */}
          </div>
        </>
      )}
    </div>
  );
}
