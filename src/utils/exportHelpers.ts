export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    console.error('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data: any[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  window.print();
};

export const exportTrackData = (tracks: any[]) => {
  const exportData = tracks.map((track) => ({
    Название: track.title,
    Артист: track.artist,
    Жанр: track.genre,
    Статус: track.status,
    Прослушивания: track.streams,
    'Дата загрузки': track.uploadDate,
  }));

  exportToCSV(exportData, `tracks_export_${new Date().toISOString().split('T')[0]}`);
};

export const exportFinancialData = (payments: any[]) => {
  const exportData = payments.map((payment) => ({
    Дата: payment.date,
    Сумма: payment.amount,
    Метод: payment.method,
    Статус: payment.status,
  }));

  exportToCSV(exportData, `payments_export_${new Date().toISOString().split('T')[0]}`);
};

export const exportAnalytics = (analytics: any) => {
  const data = {
    export_date: new Date().toISOString(),
    total_streams: analytics.totalStreams,
    total_revenue: analytics.totalRevenue,
    daily_stats: analytics.daily,
    countries: analytics.countries,
    platforms: analytics.platforms,
  };

  exportToJSON([data], `analytics_export_${new Date().toISOString().split('T')[0]}`);
};
