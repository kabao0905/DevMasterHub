const { createContext, useContext, useState, Component } = React;

const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}><div className="tabs">{children}</div></TabsContext.Provider>;
}

Tabs.List = function TabsList({ children }) {
  return <div className="tabs-list" role="tablist">{children}</div>;
};

Tabs.Trigger = function TabsTrigger({ value, children }) {
  const ctx = useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <button role="tab" aria-selected={active} className={active ? 'tab on' : 'tab'} onClick={() => ctx.setValue(value)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ value, children }) {
  const ctx = useContext(TabsContext);
  return ctx.value === value ? <div role="tabpanel" className="tab-panel">{children}</div> : null;
};

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.log('ErrorBoundary bắt được lỗi:', error.message);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="fallback">
          <b>Có lỗi xảy ra: {this.state.error.message}</b>
          <button onClick={() => this.setState({ error: null })}>Thử lại</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0);
  if (count === 3) throw new Error('Bộ đếm chạm số 3!');
  return <button onClick={() => setCount(c => c + 1)}>Bấm tới 3 sẽ lỗi: {count}</button>;
}

function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div className="track" onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) }); }}>
      {render(pos)}
    </div>
  );
}

function App() {
  return (
    <main className="panel">
      <Tabs defaultValue="compound">
        <Tabs.List>
          <Tabs.Trigger value="compound">Compound</Tabs.Trigger>
          <Tabs.Trigger value="boundary">Error Boundary</Tabs.Trigger>
          <Tabs.Trigger value="render">Render Props</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="compound">
          <p>Bộ tab này là ví dụ Compound Components: <code>Tabs.List</code>, <code>Tabs.Trigger</code>, <code>Tabs.Panel</code> chia sẻ trạng thái qua Context.</p>
        </Tabs.Panel>
        <Tabs.Panel value="boundary">
          <ErrorBoundary>
            <BuggyCounter />
          </ErrorBoundary>
        </Tabs.Panel>
        <Tabs.Panel value="render">
          <MouseTracker render={({ x, y }) => <p>Rê chuột trong khung: x = {x}, y = {y}</p>} />
        </Tabs.Panel>
      </Tabs>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
