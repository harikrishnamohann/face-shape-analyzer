import TSX from 'react';

enum PageType {
  CoverFront,
  DescPage,
  Content,
  CoverBack
};

function RenderPage(page: PageType) {
  return (
    
  );
}
function Book(): TSX.ReactElement {
  return <div className="book-frame">
    
  </div>;
}
function NavButtons() {}

export default function App() {
  return (
    <>
      <Book />
      <NavButtons />
    </>
  );
}
