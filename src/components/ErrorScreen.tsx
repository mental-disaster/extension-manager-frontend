function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center gap-4">
        <div className="text-3xl font-semibold text-slate-700">
          로딩에 실패했습니다.
        </div>
        <p className="text-slate-500 text-sm max-w-sm">
          {message || "서버와 통신하는 중 오류가 발생했습니다."}
        </p>
  
        <button
          onClick={onRetry}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          다시 시도
        </button>

        <p className="mt-3 text-[11px] text-slate-500">
            문제가 계속 발생하면, 이 화면과 함께{' '}
            <a
              href={`mailto:$dummy618234@gmail.com?subject=${encodeURIComponent("[파일 확장자 차단] 오류 보고")}&body=${encodeURIComponent(`다음과 같은 오류가 발생했습니다.\n\n오류 메시지: ${message}`)}`}
              className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              {'dummy618234@gmail.com'}
            </a>{' '}
            으로 보내주세요.
          </p>
      </div>
    );
  }

export default ErrorScreen;