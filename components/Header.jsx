import React from "react";
import { Menu, MenuMenu, MenuItem } from "semantic-ui-react";
import Link from "next/link";

function Header() {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link href="/">
        <a className="item">
          CrowdCoin
        </a>
      </Link>

      <MenuMenu position="right">
        <Link href="/">
          <a className="item">
            Crowdfunding
          </a>
        </Link>
        <Link href="/crowdfundings/new">
          <a className="item">
            +
          </a>
        </Link>
      </MenuMenu>
    </Menu>
  );
}

export default Header;