// MyComponent.js

function MyComponent() {
    return (
      <div>
        <style jsx>{`
          .myComponent {
            background-color: red;
          }
        `}</style>
        <div className="myComponent">This is a component with local CSS.</div>
      </div>
    );
  }
  
  export default MyComponent;
  