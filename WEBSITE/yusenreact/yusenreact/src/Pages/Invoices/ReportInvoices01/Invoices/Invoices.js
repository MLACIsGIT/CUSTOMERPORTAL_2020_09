export default function InvoiceDownloader(props) {
  let link;

  return (
    <div>
      <a
        href={
          "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00001.zip"
        }
      >
        <div id="InvoiceDownloader-fileDownload-icon"></div>
      </a>
    </div>
  );

  switch (props.invNum) {
    case "2022/00001":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00001"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00002":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00002"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00003":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00003"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00004":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00004"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00005":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00005"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00006":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00006"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00007":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00007"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00008":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00008"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00009":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00009"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00010":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00010"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00011":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00011"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00012":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00012"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00013":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00013"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00014":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00014"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00015":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00015"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00016":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00016"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00017":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00017"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00018":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00018"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00019":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00019"
          }
        >
          download
        </a>
      );
      break;

    case "2022/00020":
      link = (
        <a
          href={
            "https://webandtraceyusen.z6.web.core.windows.net/invoices/Yusen-invoice-2022-00020"
          }
        >
          download
        </a>
      );
      break;

    default:
      break;
  }

  return link;
}
