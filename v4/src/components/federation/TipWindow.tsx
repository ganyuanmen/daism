import { useState } from "react";
import { Modal, Button, InputGroup, Form, Alert } from "react-bootstrap";
import { YesSvg } from "../../lib/jssvg/SvgCollection";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";

import {type RootState, type AppDispatch, setTipText, setErrText } from "@/store/store";
import Member from "./Member";
import { getDaismContract } from "@/lib/globalStore";
import Image from "next/image";

interface TipWindowProps {
  owner: string;
  messageObj: EnkiMessType;
}


export default function TipWindow({ owner, messageObj }: TipWindowProps) {
  
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [noBlance, setNoBlance] = useState<boolean>(false);
  const [uping, setUping] = useState<boolean>(false);
  const [isMint, setIsMint] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  
  let daismObj;
  const utokenBalance = useSelector((state:RootState) => state.valueData.utoBalance);

  const t = useTranslations("ff");
  const tc = useTranslations("Common");
  const dispatch = useDispatch<AppDispatch>();

  function showTip(str: string) {
    dispatch(setTipText(str));
  }
  function closeTip() {
    dispatch(setTipText(""));
  }
  function showClipError(str: string) {
    dispatch(setErrText(str));
  }

  const callBack = () => {
    const _uto = parseFloat(utokenBalance);
    const _tip = parseInt(donationAmount) || 0;

    if (_tip < 1) {
      showClipError(t("lessThenOne"));
      return;
    }
    if (_tip > _uto) {
      setNoBlance(true);
      return;
    }

    showTip(t("tipsing"));
    setUping(true);
    daismObj=getDaismContract();
    if(daismObj)
      daismObj?.SingNft.mintTip(
        _tip,
        messageObj.manager,
        owner,
        isMint,
        `${messageObj.dao_id},${messageObj.message_id}`
      ).then(
        (re) => {
          setHash(re.hash);
          closeTip();
          setUping(false);
        },
        (err) => {
          setShow(false);
          console.error(err);
          closeTip();
          setUping(false);
          showClipError(tc("errorText") + (err.message ? err.message : err));
        }
      );
  };

  return (
    <>
      <button
        className="daism-ff"
        style={{ color: "red" }}
        onClick={() => setShow(true)}
        title={t("tipsTitle", {
          tips: messageObj.tips,
          utoken: messageObj.utoken,
        })}
      >
        <Image
          src="/vita.svg"
          width={20}
          height={24}
          alt={t("tipsTitle", {
            tips: messageObj.tips,
            utoken: messageObj.utoken,
          })}
        />
      </button>

      <Modal
        className="daism-title "
        show={show}
        onHide={() => {
          setShow(false);
          setHash("");
          setUping(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("tipText")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="mb-1"
            style={{ fontSize: "1.2rem", paddingLeft: "10px" }}
          >
            {t("blanceText")} : {utokenBalance} UTO
          </div>
          <div className="input-group mb-1 input-group-lg">
            <span className="input-group-text">{t("tipAuthor")}</span>
            <div className="form-control">
              <Member messageObj={messageObj} />
            </div>
          </div>

          {hash ? (
            <Alert className="daism-tip-text mt-3 mb-3">
              {t("alreadyTips")} {parseInt(donationAmount)} UTO
              <br /> hash:{hash}
            </Alert>
          ) : (
            <>
              <InputGroup size="lg" className="mb-2">
                <InputGroup.Text>{t("tipAmount")}</InputGroup.Text>
                <Form.Control
                  value={donationAmount}
                  disabled={uping}
                  onChange={(e) => {
                    setDonationAmount(e.target.value);
                  }}
                  style={{ textAlign: "right" }}
                />
                <InputGroup.Text>UTO</InputGroup.Text>
              </InputGroup>
              <Form.Check
                className="mb-3"
                type="switch"
                id="custom-switch2"
                checked={isMint}
                onChange={() => {
                  setIsMint((e) => !e);
                }}
                label={t("minthonorText")}
              />
              <div className="mt-3 mb-3" style={{ textAlign: "center" }}>
                <Button variant="primary" disabled={uping} onClick={callBack}>
                  <YesSvg size={20} /> {t("tipButton")}
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        className="modal-dialog-scrollable daism-title "
        centered
        show={noBlance}
        onHide={() => {
          setNoBlance(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("blanceTipText")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="daism-tip-body">
          <Image alt="" src="/mess.svg" width={32} height={32} />
          <div className="daism-tip-text">
            {t("InsufficientBalance")}
            <p>
              {/* 这里我注释掉 locale，因为你没传递 */}
              <a href={`/deval`}>{t("swapUTOText")}</a>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
