import React from 'react';

interface StatisticDisplayProps {
  filters: { [key: string]: string };

  numberStatistic: string;
  labelStatistic: string;
  descriptionStatistic: string;
}

const StatisticDisplay: React.FC<StatisticDisplayProps> = ({numberStatistic, labelStatistic, descriptionStatistic}) => {
  
  const styles = {
    statisticDisplay: {
        position: 'relative' as const,
      border: '1px solid black',
      borderRadius: '10px',
      padding: '20px',
      paddingLeft:'20px',
      paddingRight:'20px',
      display: 'inline-block',
    },
    statTextSmall: {
      fontSize: '12px',
      color: '#555',
      marginBottom: '8px',
    },
    statLarge: {
      margin: '10px 0',
      textAlign: 'center' as const,
    },
    statNumber: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    statLabel: {
      fontSize: '16px',
      color: '#7f8c8d',
    },
    contener: {
        padding: '20px',
        display: 'inline-block' as const,
        position: 'relative' as const,
    }
  };

  return (
    <div style={styles.contener}>
        <div style={styles.statisticDisplay}>
        <div style={styles.statLabel}>{labelStatistic}</div>
        <div style={styles.statLarge}>
            <span style={styles.statNumber}>{numberStatistic}</span>
        </div>
        <div style={styles.statTextSmall}>{descriptionStatistic}</div>
        </div>
    </div>
  );
};

export { StatisticDisplay };
