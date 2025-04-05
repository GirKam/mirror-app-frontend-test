import './SettingsPanel.css';
import { Settings } from '../../../server/src/settings/interface';

interface SettingsPanelProps {
  settings: Settings;
  onRefresh: () => void;
}

const SettingsPanel = ({ settings, onRefresh }: SettingsPanelProps) => {
  const { layout, template, navigation } = settings;
  const layoutParams = layout.params[layout.current];

  return (
    <div className="settings-panel">
      <div className="settings-info">
        <h3>Текущие настройки:</h3>
        <p>Шаблон: {layout.current === 'grid' ? 'Сетка' : 'Плиточная верстка'}</p>
        <p>Колонки: {layoutParams.columns}</p>
        <p>Ряды: {layoutParams.rows}</p>
        <p>Карточка: {template === 'classic' ? 'Классическая' : 'При наведении'}</p>
        <p>Навигация:{navigation === 'load-more' ? "Кнопка 'Загрузить еще'" : 'Пагинация'}</p>
      </div>
      <button className="refresh-button" onClick={onRefresh}>
        Обновить настройки
      </button>
    </div>
  );
};

export default SettingsPanel;
