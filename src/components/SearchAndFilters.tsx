import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SearchAndFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  status: string[];
  genre: string[];
  dateRange: string;
  sortBy: string;
}

const statusOptions = [
  { value: 'pending', label: 'На модерации', color: 'bg-yellow-500/20 text-yellow-500' },
  { value: 'approved', label: 'Одобрено', color: 'bg-primary/20 text-primary' },
  { value: 'published', label: 'Опубликовано', color: 'bg-blue-500/20 text-blue-500' },
  { value: 'needs_revision', label: 'Требует правок', color: 'bg-accent/20 text-accent' },
];

const genreOptions = [
  'Electronic', 'Pop', 'Hip-Hop', 'Rock', 'Jazz', 'Classical',
  'R&B', 'Country', 'Reggae', 'Blues', 'Metal', 'Indie', 'Ambient'
];

const dateRangeOptions = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Эта неделя' },
  { value: 'month', label: 'Этот месяц' },
  { value: 'quarter', label: 'Этот квартал' },
  { value: 'year', label: 'Этот год' },
  { value: 'all', label: 'Все время' },
];

const sortOptions = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'streams-desc', label: 'По популярности' },
  { value: 'title-asc', label: 'По названию (А-Я)' },
];

const SearchAndFilters = ({ onSearch, onFilterChange }: SearchAndFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    genre: [],
    dateRange: 'all',
    sortBy: 'date-desc',
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[type];
      let updated;
      
      if (Array.isArray(current)) {
        updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
      } else {
        updated = value;
      }

      const newFilters = { ...prev, [type]: updated };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      status: [],
      genre: [],
      dateRange: 'all',
      sortBy: 'date-desc',
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    onFilterChange?.(clearedFilters);
    onSearch?.('');
  };

  const activeFiltersCount =
    filters.status.length +
    filters.genre.length +
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Поиск по названию или артисту..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Icon name="Filter" size={18} />
                Фильтры
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center justify-between">
                    <span>Фильтры</span>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-7 text-xs"
                      >
                        Сбросить
                      </Button>
                    )}
                  </h4>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Статус</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant="outline"
                        className={`cursor-pointer transition-all ${
                          filters.status.includes(option.value)
                            ? option.color
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => toggleFilter('status', option.value)}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Жанр</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {genreOptions.map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className={`cursor-pointer transition-all ${
                          filters.genre.includes(genre)
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => toggleFilter('genre', genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Период</label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => toggleFilter('dateRange', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Select
            value={filters.sortBy}
            onValueChange={(value) => toggleFilter('sortBy', value)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Icon name="ArrowUpDown" size={16} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filters.status.length > 0 || filters.genre.length > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Активные фильтры:</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Поиск: "{searchQuery}"
              <Icon
                name="X"
                size={12}
                className="cursor-pointer"
                onClick={() => handleSearchChange('')}
              />
            </Badge>
          )}

          {filters.status.map((status) => {
            const option = statusOptions.find((o) => o.value === status);
            return (
              <Badge
                key={status}
                variant="outline"
                className={`gap-1 ${option?.color}`}
              >
                {option?.label}
                <Icon
                  name="X"
                  size={12}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('status', status)}
                />
              </Badge>
            );
          })}

          {filters.genre.map((genre) => (
            <Badge key={genre} variant="outline" className="gap-1">
              {genre}
              <Icon
                name="X"
                size={12}
                className="cursor-pointer"
                onClick={() => toggleFilter('genre', genre)}
              />
            </Badge>
          ))}

          {(filters.status.length > 0 || filters.genre.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs"
            >
              Очистить все
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
