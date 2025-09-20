import * as React from 'react';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: React.ReactNode;
};

const NextLinkMock: React.FC<Props> = ({ href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);

NextLinkMock.displayName = 'NextLinkMock';
export default NextLinkMock;
