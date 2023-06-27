import styled from "styled-components";
import { Text } from "react-native";

export const Title = styled(Text)`
  font-size: ${(props) => props.size};
  color: ${(props) => props.color};
  margin-bottom: ${(props) => props.bottom};
`;
