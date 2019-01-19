# frozen_string_literal: true

require "migrator/migrator"

module Migrator
  class Command
    def initialize(args)
      @base_dir =
        if args.empty?
          File.expand_path("../../../source", __dir__)
        else
          File.expand_path(args.first)
        end
    end

    def call
      article_files.each do |f|
        Migrator.new(f, @base_dir).call
      end
    end

    private

    def article_files
      Dir.glob(File.join(articles_directory, "*"))
    end

    def articles_directory
      File.expand_path("../../../source/articles", __dir__)
    end
  end
end
