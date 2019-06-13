require "time"

Dir["content/**/*"].each do |f|
  next unless File.file?(f)

  content = File.read(f)

  m = /^created_at: (?<created_at>.+)$/.match(content)
  created_at = Time.parse(m[:created_at])
  m = /^updated_at: (?<updated_at>.+)$/.match(content)
  updated_at = Time.parse(m[:updated_at])
  m = /^tags: (?<tags>.+)$/.match(content)
  tags = m[:tags].split(",").map(&:strip) if m

  content = content.sub(/^tags: .+$/, "").sub("---", <<~HEAD)
    ---
    date: #{created_at.strftime("%Y-%m-%dT%H:%M:%S%z")}
    lastmod: #{updated_at.strftime("%Y-%m-%dT%H:%M:%S%z")}
    tags: #{tags}
    draft: false
    isCJKLanguage: true
  HEAD

  File.write(f, content)

  puts "Converted #{f}"

rescue => e
  puts "Error: #{f}"
  puts e
  raise e
end
