import React from "react";
import styled from "styled-components";
import { useLink } from "@nano-router/react";
import Octocat from "../icons/Octocat.png";

const FooterPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const OctocatImage = styled.img`
  margin: 10px;
`;

export const Footer = () => {
  const showGithubPage = useLink({ route: "github/example", target: "_blank" });

  return (
    <FooterPanel>
      <a {...showGithubPage}>Fork me on Github</a>
      <OctocatImage src={Octocat} alt="Github Octocat" />
    </FooterPanel>
  );
};
