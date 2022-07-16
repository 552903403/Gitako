import { ReactIO } from 'common'
import { IN_PRODUCTION_MODE } from 'env'
import * as React from 'react'
import { useStateIO } from 'utils/hooks/useStateIO'

export type InspectorContextShape = ReactIO<JSONObject>

export const InspectorContext = React.createContext<InspectorContextShape | null>(null)

export const InspectorContextWrapper = IN_PRODUCTION_MODE
  ? React.Fragment
  : function InspectorContextWrapper({ children }: React.PropsWithChildren<{}>) {
      const $ = useStateIO<JSONObject>({})
      const [show, setShow] = React.useState(true)

      return (
        <InspectorContext.Provider value={$}>
          {show ? (
            <div
              style={{
                position: 'fixed',
                top: '0',
                right: '0',
                height: '100vh',
                width: '360px',
                overflow: 'auto',
                background: 'rgba(255, 255, 255, 0.75)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <pre style={{ flex: 1 }}>{JSON.stringify($.value, null, 2)}</pre>
              <div>
                <button onClick={() => setShow(false)}>❌</button>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: 'fixed',
                bottom: '0',
                right: '0',
              }}
            >
              <button onClick={() => setShow(true)}>🔎</button>
            </div>
          )}
          {children}
        </InspectorContext.Provider>
      )
    }

export function useInspector(key: string, value: JSONValue) {
  const $ = React.useContext(InspectorContext)
  React.useEffect(() => {
    $?.onChange(prev => ({ ...prev, [key]: value }))
  }, [key, value]) // eslint-disable-line react-hooks/exhaustive-deps
}
