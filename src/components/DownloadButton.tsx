import React from 'react';
import styled from 'styled-components';

interface DownloadButtonProps {
  onDownload?: () => void;
  text?: string;
  completedText?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownload,
  text = "Download",
  completedText = "Open"
}) => {
  return (
    <StyledWrapper>
      <div className="container" onClick={onDownload}>
        <label className="label">
          <input type="checkbox" className="input" />
          <span className="circle">
            <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19V5m0 14-4-4m4 4 4-4" />
            </svg>
            <div className="square" />
          </span>
          <p className="title">{text}</p>
          <p className="title">{completedText}</p>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .label {
    background-color: var(--card);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    border-radius: 8px;
    width: 140px;
    height: 40px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    padding: 4px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  }

  .label:hover {
    border-color: var(--primary);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .label::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--primary);
    width: 6px;
    height: 6px;
    transition: all 0.4s ease;
    border-radius: 100%;
    margin: auto;
    opacity: 0;
    visibility: hidden;
    z-index: 0;
  }

  .label .input {
    display: none;
  }

  .label .title {
    font-size: 9px;
    font-weight: 800;
    color: var(--app-text);
    transition: all 0.4s ease;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    z-index: 2;
  }

  .label .title:last-child {
    opacity: 0;
    visibility: hidden;
    color: var(--success);
  }

  .label .circle {
    height: 32px;
    width: 32px;
    border-radius: 6px;
    background-color: var(--primary);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    z-index: 2;
  }

  .label .circle .icon {
    color: white;
    width: 16px;
    height: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  .label .circle .square {
    aspect-ratio: 1;
    width: 10px;
    border-radius: 2px;
    background-color: white;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }

  .label .circle::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 0.3);
    width: 100%;
    height: 0;
    transition: all 0.4s ease;
  }

  .label:has(.input:checked) {
    width: 40px;
    border-color: var(--primary);
    animation: installed 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 3.5s forwards;
  }

  .label:has(.input:checked)::before {
    animation: rotate 3s ease-in-out 0.4s forwards;
  }

  .label .input:checked + .circle {
    border-radius: 50%;
    animation:
      pulse 1s forwards,
      circleDelete 0.2s ease 3.5s forwards;
    rotate: 180deg;
  }

  .label .input:checked + .circle::before {
    animation: installing 3s ease-in-out forwards;
  }

  .label .input:checked + .circle .icon {
    opacity: 0;
    visibility: hidden;
  }

  .label .input:checked ~ .circle .square {
    opacity: 1;
    visibility: visible;
  }

  .label .input:checked ~ .title {
    opacity: 0;
    visibility: hidden;
  }

  .label .input:checked ~ .title:last-child {
    animation: showInstalledMessage 0.4s ease 3.5s forwards;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 var(--primary);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }

  @keyframes installing {
    from { height: 0; }
    to { height: 100%; }
  }

  @keyframes rotate {
    0% {
      transform: rotate(-90deg) translate(18px) rotate(0);
      opacity: 1;
      visibility: visible;
    }
    99% {
      transform: rotate(270deg) translate(18px) rotate(270deg);
      opacity: 1;
      visibility: visible;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes installed {
    100% {
      width: 140px;
      border-color: var(--success);
      background-color: var(--success);
    }
  }

  @keyframes circleDelete {
    100% {
      opacity: 0;
      visibility: hidden;
      transform: scale(0);
    }
  }

  @keyframes showInstalledMessage {
    100% {
      opacity: 1;
      visibility: visible;
      right: 50%;
      transform: translate(50%, -50%);
      color: white;
    }
  }
`;

export default DownloadButton;
