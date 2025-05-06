const { describe, it, expect, beforeEach, jest: jestGlobal } = require('@jest/globals');
const urlService = require('../src/services/url.service');
const { Url } = require('../src/models');
const redisService = require('../src/services/redis.service');

// Mock dependencies
jest.mock('../src/models', () => ({
  Url: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    sequelize: {
      literal: jest.fn((str) => str),
    },
  },
}));

jest.mock('../src/services/redis.service', () => ({
  setUrl: jest.fn(),
  getUrl: jest.fn(),
  deleteUrl: jest.fn(),
}));

describe('URL Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jestGlobal.clearAllMocks();
  });

  describe('generateUniqueCode', () => {
    it('should generate a unique code', async () => {
      // Mock that no URL exists with the generated code
      Url.findOne.mockResolvedValue(null);

      const code = await urlService.generateUniqueCode();
      
      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
      expect(Url.findOne).toHaveBeenCalled();
    });

    it('should throw an error if unable to generate a unique code', async () => {
      // Mock that a URL always exists with any generated code
      Url.findOne.mockResolvedValue({ id: 'some-id' });

      await expect(urlService.generateUniqueCode()).rejects.toThrow(
        'Failed to generate a unique short code after multiple attempts'
      );
    });
  });

  describe('validateCustomCode', () => {
    it('should return valid for a good custom code', async () => {
      Url.findOne.mockResolvedValue(null);

      const result = await urlService.validateCustomCode('valid-code');
      
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for an empty code', async () => {
      const result = await urlService.validateCustomCode('');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should return invalid for a code with invalid characters', async () => {
      const result = await urlService.validateCustomCode('invalid@code');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('only contain');
    });

    it('should return invalid for a code that is too short', async () => {
      const result = await urlService.validateCustomCode('ab');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('between 3 and 20');
    });

    it('should return invalid for a code that already exists', async () => {
      Url.findOne.mockResolvedValue({ id: 'some-id' });

      const result = await urlService.validateCustomCode('existing-code');
      
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('already in use');
    });
  });

  describe('createUrl', () => {
    it('should create a URL with a generated code', async () => {
      // Mock generateUniqueCode to return a fixed value
      const mockGenerateUniqueCode = jest.spyOn(urlService, 'generateUniqueCode');
      mockGenerateUniqueCode.mockResolvedValue('abc123');

      // Mock database create
      const mockUrl = {
        id: 'uuid',
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        expiresAt: null,
        isCustom: false,
        createdAt: new Date(),
      };
      Url.create.mockResolvedValue(mockUrl);

      const result = await urlService.createUrl({
        originalUrl: 'https://example.com',
      });

      expect(result).toEqual(mockUrl);
      expect(Url.create).toHaveBeenCalledWith({
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        expiresAt: null,
        isCustom: false,
      });
      expect(redisService.setUrl).toHaveBeenCalled();

      // Clean up
      mockGenerateUniqueCode.mockRestore();
    });

    it('should create a URL with a custom code', async () => {
      // Mock validateCustomCode to return valid
      const mockValidateCustomCode = jest.spyOn(urlService, 'validateCustomCode');
      mockValidateCustomCode.mockResolvedValue({ isValid: true });

      // Mock database create
      const mockUrl = {
        id: 'uuid',
        originalUrl: 'https://example.com',
        shortCode: 'custom',
        expiresAt: null,
        isCustom: true,
        createdAt: new Date(),
      };
      Url.create.mockResolvedValue(mockUrl);

      const result = await urlService.createUrl({
        originalUrl: 'https://example.com',
        customCode: 'custom',
      });

      expect(result).toEqual(mockUrl);
      expect(Url.create).toHaveBeenCalledWith({
        originalUrl: 'https://example.com',
        shortCode: 'custom',
        expiresAt: null,
        isCustom: true,
      });
      expect(redisService.setUrl).toHaveBeenCalled();

      // Clean up
      mockValidateCustomCode.mockRestore();
    });

    it('should throw an error if custom code validation fails', async () => {
      // Mock validateCustomCode to return invalid
      const mockValidateCustomCode = jest.spyOn(urlService, 'validateCustomCode');
      mockValidateCustomCode.mockResolvedValue({ 
        isValid: false, 
        message: 'Custom code is invalid' 
      });

      await expect(urlService.createUrl({
        originalUrl: 'https://example.com',
        customCode: 'invalid',
      })).rejects.toThrow('Custom code is invalid');

      expect(Url.create).not.toHaveBeenCalled();

      // Clean up
      mockValidateCustomCode.mockRestore();
    });
  });

  describe('getOriginalUrl', () => {
    it('should return the original URL from cache', async () => {
      // Mock Redis cache hit
      redisService.getUrl.mockResolvedValue({
        originalUrl: 'https://example.com',
        expiresAt: null,
      });

      // Mock incrementClickCount
      const mockIncrementClickCount = jest.spyOn(urlService, 'incrementClickCount');
      mockIncrementClickCount.mockResolvedValue();

      const result = await urlService.getOriginalUrl('abc123');

      expect(result).toBe('https://example.com');
      expect(redisService.getUrl).toHaveBeenCalledWith('abc123');
      expect(mockIncrementClickCount).toHaveBeenCalledWith('abc123');
      expect(Url.findOne).not.toHaveBeenCalled();

      // Clean up
      mockIncrementClickCount.mockRestore();
    });

    it('should return the original URL from database on cache miss', async () => {
      // Mock Redis cache miss
      redisService.getUrl.mockResolvedValue(null);

      // Mock database hit
      Url.findOne.mockResolvedValue({
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        expiresAt: null,
      });

      // Mock incrementClickCount
      const mockIncrementClickCount = jest.spyOn(urlService, 'incrementClickCount');
      mockIncrementClickCount.mockResolvedValue();

      const result = await urlService.getOriginalUrl('abc123');

      expect(result).toBe('https://example.com');
      expect(redisService.getUrl).toHaveBeenCalledWith('abc123');
      expect(Url.findOne).toHaveBeenCalled();
      expect(mockIncrementClickCount).toHaveBeenCalledWith('abc123');
      expect(redisService.setUrl).toHaveBeenCalled();

      // Clean up
      mockIncrementClickCount.mockRestore();
    });

    it('should return null if URL is not found', async () => {
      // Mock Redis cache miss
      redisService.getUrl.mockResolvedValue(null);

      // Mock database miss
      Url.findOne.mockResolvedValue(null);

      const result = await urlService.getOriginalUrl('nonexistent');

      expect(result).toBeNull();
      expect(redisService.getUrl).toHaveBeenCalledWith('nonexistent');
      expect(Url.findOne).toHaveBeenCalled();
    });

    it('should return null and delete from cache if URL has expired', async () => {
      // Mock Redis cache hit but expired
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // 1 day in the past
      
      redisService.getUrl.mockResolvedValue({
        originalUrl: 'https://example.com',
        expiresAt: pastDate.toISOString(),
      });

      const result = await urlService.getOriginalUrl('expired');

      expect(result).toBeNull();
      expect(redisService.getUrl).toHaveBeenCalledWith('expired');
      expect(redisService.deleteUrl).toHaveBeenCalledWith('expired');
    });
  });
});