import { FrameRequest, MockFrameRequestOptions } from '@coinbase/onchainkit';
import { parseHtml } from './parseHtml';
import { frameResultToFrameMetadata } from './frameResultToFrameMetadata';

type FrameData = FrameRequest['untrustedData'];

export async function postFrame(frameData: FrameData, options?: MockFrameRequestOptions) {
  // TODO: handle exceptional cases
  const res = await fetch('/api/postFrame', {
    body: JSON.stringify({
      frameData,
      options,
    }),
    method: 'POST',
    headers: {
      contentType: 'application/json',
    },
  });
  const json = await res.json();

  if (json.redirectUrl) {
    window.location.href = json.redirectUrl;
    return;
  }

  const html = json.html;
  const parsedHtml = parseHtml(html);
  return {
    ...parsedHtml,
    tags: frameResultToFrameMetadata(parsedHtml.tags),
  };
}
