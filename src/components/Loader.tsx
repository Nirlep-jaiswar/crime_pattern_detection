import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="loader-inner">
          <div className="loader-block" />
          <div className="loader-block" />
          <div className="loader-block" />
          <div className="loader-block" />
          <div className="loader-block" />
          <div className="loader-block" />
          <div className="loader-block" />
          <div className="loader-block" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 200px;

  /* Theme-aware variables */
  --loader-color: #ffffff;
  --loader-glow: #ffffff;
  --loader-glow-active: rgba(255, 255, 255, 0.7);
  --loader-glow-dim: rgba(255, 255, 255, 0.5);

  :root.light & {
    --loader-color: #1e293b; /* Tactical Slate (Prominent in light mode) */
    --loader-glow: #1e293b;
    --loader-glow-active: rgba(30, 41, 59, 0.5);
    --loader-glow-dim: rgba(30, 41, 59, 0.2);
  }

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    position: relative;
  }

  .loader:before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
  }

  .loader-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .loader-block {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 2px;
    background-color: var(--loader-color);
    box-shadow: 0 0 20px var(--loader-glow);
    animation: loader_562 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }

  .loader-block:nth-child(1) {
    animation-delay: 0.1s;
  }

  .loader-block:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loader-block:nth-child(3) {
    animation-delay: 0.3s;
  }

  .loader-block:nth-child(4) {
    animation-delay: 0.4s;
  }

  .loader-block:nth-child(5) {
    animation-delay: 0.5s;
  }

  .loader-block:nth-child(6) {
    animation-delay: 0.6s;
  }

  .loader-block:nth-child(7) {
    animation-delay: 0.7s;
  }

  .loader-block:nth-child(8) {
    animation-delay: 0.8s;
  }

  @keyframes loader_562 {
    0% {
      transform: scale(1);
      box-shadow: 0 0 20px var(--loader-glow-dim);
    }

    20% {
      transform: scale(1, 2.5);
      box-shadow: 0 0 50px var(--loader-glow-active);
    }

    40% {
      transform: scale(1);
      box-shadow: 0 0 20px var(--loader-glow-dim);
    }
  }`;

export default Loader;
