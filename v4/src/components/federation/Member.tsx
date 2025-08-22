import { FC } from "react";
import { User1Svg } from "@/lib/jssvg/SvgCollection";
import ShowAddress from "../ShowAddress";
import { useTranslations } from "next-intl";

interface Props {
  messageObj: EnkiMessType;
}

const Member: FC<Props> = ({ messageObj }) => {
  const t = useTranslations("ff");
  const manager = messageObj.manager;
  const account = messageObj?.self_account || messageObj.actor_account;
  const avatar = messageObj?.self_avatar || messageObj.avatar;
  const [enkiName, domain] = account.split("@");

  return (
    <div style={{ width: "90%" }} className="d-inline-flex align-items-center">
      <a href={`https://${domain}/${enkiName}`} className="daism-a">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            width={48}
            height={48}
            style={{ borderRadius: "10px" }}
          />
        ) : (
          <User1Svg size={48} />
        )}
      </a>
      <div style={{ paddingLeft: "2px", width: "100%" }}>
        <div className="daism-account">{account}</div>
        <ShowAddress address={manager} />
      </div>
    </div>
  );
};

export default Member;
