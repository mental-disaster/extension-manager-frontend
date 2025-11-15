import { useEffect, useRef, useState } from "react";
import { createCustomExtension, deleteCustomExtension, getExtensions, updateExtensionBlockStatus } from "./api/extensions";
import type { Extension } from "./api/extensions";
import SkeletonSection from "./components/SkeletonSection";
import Spinner from "./components/Spinner";
import ErrorScreen from "./components/ErrorScreen";

function App() {
  const [loading, setLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newExtName, setNewExtName] = useState<string>("");
  const [updateFixedError, setUpdateFixedError] = useState<string>("");
  const [createCustomError, setCreateCustomError] = useState<string>("");
  const [deleteCustomError, setDeleteCustomError] = useState<string>("");
  const [extensions, setExtensions] = useState<Extension[]>([]);

  const newExtInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setInitialLoadError("");

        const extensions = await getExtensions();

        setExtensions(extensions);
      } catch (err: any) {
        console.error(err);
        setInitialLoadError(err?.message ?? "초기 데이터 로딩에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!creating) {
      newExtInputRef.current?.focus();
    }
  }, [creating]);

  const handleFixedExtensionToggle = async (ext: Extension, newValue: boolean) => {
    setUpdateFixedError('');

    try {
      setUpdating(ext.name);
      const updated = await updateExtensionBlockStatus(ext.name, newValue);

      setExtensions((prev) => 
        prev.map((e) => (e.name === ext.name ? updated : e))
      );
    } catch (err: any) {
      console.error(err);
      setUpdateFixedError(err?.message ?? "고정 확장자 수정 중 오류가 발생했습니다.");
    } finally {
      setUpdating(null);
    }
  }
  
  const handleCreateCustomExtension = async () => {
    setCreateCustomError('');
    const trimmedExt = newExtName.trim().toLocaleLowerCase().replace(/^\.+/, '');

    if (!trimmedExt) {
      setCreateCustomError('확장자명을 입력해주세요.');
      return;
    }
    if (!/^[a-z0-9]+$/.test(trimmedExt)) {
      setCreateCustomError('확장자명은 알파벳 소문자와 숫자만 가능합니다.');
      return;
    }
    if (trimmedExt.length > 20) {
      setCreateCustomError('확장자명은 20자 이하로 입력 가능합니다.');
      return;
    }

    try {
      setCreating(true);
      const created = await createCustomExtension(trimmedExt);

      setExtensions((prev) => [...prev, created]);
      setNewExtName('');
    } catch (err: any) {
      console.error(err);
      setCreateCustomError(err?.message ?? "확장자 생성 중 오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  }

  const handleDeleteCustomExtension = async (delExtName: string) => {
    setDeleteCustomError('');

    try {
      setDeleting(delExtName);
      await deleteCustomExtension(delExtName);

      setExtensions(prev => prev.filter(ext => ext.name !== delExtName));
    } catch (err: any) {
      console.error(err);
      setDeleteCustomError(err.message ?? "확장자 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* 상단 헤더 */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">
            파일 확장자 차단
          </h1>
        </div>
      </header>

      {/* 메인 컨테이너 */}
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">

        {loading ? (
          <>
            <SkeletonSection />
            <SkeletonSection />
          </>
        ) : initialLoadError ? (
          <ErrorScreen message={initialLoadError} onRetry={() => window.location.reload()} />
        ) : (
          <>
            {/* 고정 확장자 설정 */}
            <section className="rounded-xl bg-white p-4 shadow-sm space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold">
                  고정 확장자 관리
                </h2>
                <span className="text-xs text-slate-500">
                  자주 차단하는 미리 정의된 실행/스크립트 파일 확장자를 관리합니다.
                </span>
              </div>

              <p className="text-xs text-slate-500">
                각 확장자를 체크하면 해당 확장자를 가진 파일 업로드를 차단하는 것으로 간주합니다.
              </p>

              <div className="flex flex-wrap gap-2">
                {extensions.filter((ext) => ext.type === 'FIXED').map((fixedExt: Extension) => (
                  <label
                    key={fixedExt.name}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs cursor-default"
                  >
                    <input
                      type="checkbox"
                      className="h-3 w-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={fixedExt.isBlocked}
                      disabled={updating === fixedExt.name}
                      onChange={(e) =>
                        handleFixedExtensionToggle(fixedExt, e.target.checked)
                      }
                    />
                    <span className="font-mono text-[11px]">
                      .{fixedExt.name}
                    </span>
                    {updating === fixedExt.name && (
                      <Spinner />
                    )}
                  </label>
                ))}
              </div>
              {updateFixedError && (
                <p className="text-xs text-red-600 mt-1 ml-2">
                  {updateFixedError}
                </p>
              )}
            </section>

            {/* 커스텀 확장자 관리 */}
            <section className="rounded-xl bg-white p-4 shadow-sm space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold">
                  커스텀 확장자 관리
                </h2>
                <span className="text-xs text-slate-500">
                  최대 200개까지 확장자를 추가할 수 있습니다.
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  추가로 차단할 확장자를 등록합니다.
                  영문 소문자 및 숫자 최대 20자까지 입력 가능합니다.
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      ref={newExtInputRef}
                      type="text"
                      placeholder="예: pdf, hwp, zip"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                      disabled:bg-slate-100 disabled:border-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed"
                      value={newExtName}
                      disabled={creating}
                      onChange={(e) => {
                        setNewExtName(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateCustomExtension();
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={creating}
                    onClick={handleCreateCustomExtension}
                  >
                    { creating ? '추가중...' : '추가' }
                  </button>
                </div>

                {createCustomError && (
                  <p className="text-xs text-red-600 mt-1 ml-2">
                    {createCustomError}
                  </p>
                )}
              </div>

              {/* 커스텀 확장자 리스트 */}
              <div className="border-t border-slate-100 pt-3">
                <h3 className="mb-2 text-xs font-semibold text-slate-600">
                  등록된 커스텀 확장자 ({extensions.filter((ext) => ext.type === 'CUSTOM').length}/200)
                </h3>

                <div className="flex flex-wrap gap-2">
                  {extensions.filter((ext) => ext.type === 'CUSTOM').map((ext: Extension) => (
                    <span
                      key={ext.name}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs border border-slate-200"
                    >
                      <span className="font-mono text-[11px]">
                        .{ext.name}
                      </span>
                      <button
                        type="button"
                        className="ml-1 text-slate-400 hover:text-red-600 cursor-default"
                        onClick={() => handleDeleteCustomExtension(ext.name)}
                      >
                        ×
                      </button>
                      {deleting === ext.name && (
                        <Spinner />
                      )}
                    </span>
                  ))}
                </div>

                {deleteCustomError && (
                  <p className="text-xs text-red-600 mt-1 ml-2">
                    {deleteCustomError}
                  </p>
                )}
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}

export default App;
