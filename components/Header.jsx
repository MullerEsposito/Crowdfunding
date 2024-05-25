import React from "react";
import { Menu, MenuMenu, MenuItem } from "semantic-ui-react";
import { Link } from "../routes";

function Header() {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">
          CrowdCoin
        </a>
      </Link>

      <MenuMenu position="right">
        <Link route="/">
          <a className="item">
            Crowdfunding
          </a>
        </Link>
        <Link route="/crowdfundings/new">
          <a className="item">
            +
          </a>
        </Link>
      </MenuMenu>
    </Menu>
  );
}

export default Header;