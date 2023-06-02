'use client';
import React, { useCallback, useMemo } from "react";
import toast, { Toast, useToaster } from "react-hot-toast";

interface ToastExtend extends Toast {
  renderAction: any;
}

type ToastItemProps = {
  t: ToastExtend;
  offset: number;
  updateHeight: (toastId: string, height: number) => void;
};

const ToastItem = ({ t, offset, updateHeight }: ToastItemProps) => {
  const ref = useCallback(
    (el: HTMLDivElement) => {
      if (el && !t.height) {
        const { height } = el.getBoundingClientRect();
        updateHeight(t.id, height);
      }
    },
    [t.height, t.id, updateHeight]
  );
  const onDismiss = useCallback(() => {
    toast.dismiss(t.id);
  }, [t.id]);
  const ariaProps = useMemo<any>(() => t.ariaProps, [t.ariaProps]);
  const onToastClick = useCallback(() => {
    ariaProps.onClick?.();
    onDismiss();
  }, [ariaProps, onDismiss]);
  return (
    <div
      ref={ref}
      className="toast-notification__container"
      style={{
        position: "absolute",
        transition: "all 0.5s ease-out",
        opacity: t.visible ? 1 : 0,
        transform: `translateY(${offset}px)`,
      }}
      {...ariaProps}
      onClick={onToastClick}
    >
      <span className={`toast-notification__title title-${t.type}`}>
        {t.className || t.type}
      </span>
      {ariaProps?.subtitle && (
        <span className="toast-notification__subtitle">
          {ariaProps.subtitle}
        </span>
      )}
      <span className="toast-notification__message">
        {t.message?.toString()}
      </span>
      {!!t.renderAction && t.renderAction()}
      <div className="btn-delete" onClick={onDismiss}>
        <img alt="" src="/assets/images/ic_close.svg" />
      </div>
    </div>
  );
};

const AppToastNotification = () => {
  const { toasts, handlers }: any = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;
  const renderToast = useCallback(
    (t: ToastExtend) => {
      const offset = calculateOffset(t, {
        reverseOrder: false,
        gutter: 10,
      });
      return (
        <ToastItem
          key={t.id}
          t={t}
          offset={offset}
          updateHeight={updateHeight}
        />
      );
    },
    [calculateOffset, updateHeight]
  );
  return (
    <div
      className="toast-notification__root"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map(renderToast)}
    </div>
  );
};

export default AppToastNotification;
