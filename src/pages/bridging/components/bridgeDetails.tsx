import { Text } from "global/packages/src";
import { ReactNode } from "react";
import { BridgingNetwork } from "../config/bridgingInterfaces";

export function getBridgeExtraDetails1(
  bridgeIn: boolean,
  from: string,
  to: string,
  nonCantoNetwork: BridgingNetwork
) {
  return (
    <Text size="text4" align="left" style={{ color: "#474747" }}>
      {`by completing bridge ${
        bridgeIn ? "in" : "out"
      }, you are transferring your assets from ${
        bridgeIn ? `${nonCantoNetwork.name}` : "althea"
      } (${from}) to ${
        bridgeIn ? "althea" : `${nonCantoNetwork.name}`
      } (${to}).`}
    </Text>
  );
}

export function getBridgeExtraDetails(
  bridgeIn: boolean,
  native: boolean,
  from: string,
  to: string
): ReactNode {
  return (
    <Text size="text4" align="left" style={{ color: "#474747" }}>
      {native ? (
        <>
          {`by completing bridge ${
            bridgeIn ? "in" : "out"
          }, you are transferring your assets from your althea native address (${from}) to your ${
            bridgeIn
              ? "althea EVM address (" + to + ")"
              : "address on the " + to + " network"
          }. Read more about this `}
          <a
            role="button"
            tabIndex={0}
            onClick={() =>
              window.open(
                bridgeIn
                  ? "https://docs.canto.io/user-guides/converting-assets"
                  : "https://docs.canto.io/user-guides/bridging-assets/from-canto",
                "_blank"
              )
            }
            style={{
              color: "var(--primary-color)",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            here.
          </a>
        </>
      ) : (
        `by bridging ${
          bridgeIn ? "in" : "out"
        }, you are transferring your assets from your ${
          bridgeIn ? "ethereum " : "althea "
        } EVM address (${from}) to your althea native address (${to}) ${
          bridgeIn ? "through gravity bridge." : "."
        }`
      )}
    </Text>
  );
}
